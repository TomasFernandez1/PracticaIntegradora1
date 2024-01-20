import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import logger from "morgan";

import { __dirname } from "./utils.js";
import productModel from "./models/products.models.js";
import messageModel from "./models/messages.models.js";
import { connectDB } from "./config/config.js";

// Routes
import productsRoute from "./routes/products.routes.js";
import cartsRoute from "./routes/carts.routes.js";

// Create Express and ProductManager instances
const app = express();

// Configuration of the server
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
connectDB();

// Configuration of views
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Endpoint of the Products in real time
app.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", { pageTitle: "Product List Real Time" });
});

// Endpoint of the Products
app.get("/", async (req, res) => {
  const listadeproductos = await productModel.find().lean();
  res.render("home", { listadeproductos });
});

app.get('/chat', async (req, res) => {
  try {
      // Obtener los mensajes del chat desde la base de datos
      const messages = await messageModel.find().lean();
      res.render('chat', { messages });
  } catch (err) {
      console.error(err);
      res.status(500).send({ "Message": err.message });
  }
});


// Endpoints
app.use("/api", productsRoute);
app.use("/api", cartsRoute);

// Create server on port 8080
const httpServer = app.listen(8080, () => {
  console.log("Listening port 8080");
});

// Create webSocket
const io = new Server(httpServer);

// Socket connection
io.on("connection", async (socket) => {
  console.log("client connected con ID:", socket.id);

  // Get all the products
  const productList = await productModel.find().lean();

  // Emit an event to send all the products to the Client
  io.emit("sendProducts", productList);

  // Recieve the addProduct event from the Client
  socket.on("addProduct", async (obj) => {
    await productModel.create(obj);
    const productList = await productModel.find().lean();
    io.emit("sendProducts", productList);
  });

  // Recieve the deleteProduct event from the Client
  socket.on("deleteProduct", async (id) => {
    await productModel.findOneAndDelete({ _id: id });
    const productList = await productModel.find().lean();
    io.emit("sendProducts", productList);
  });


  socket.on('chat message', async (msg) => {
    console.log('Mensaje recibido:', msg);

    // Guardar el mensaje en la base de datos
    await messageModel.create(msg);

    // Enviar el mensaje a todos los clientes conectados
    io.emit('chat message', msg);
});

});
