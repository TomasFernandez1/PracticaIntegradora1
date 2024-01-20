import { Router } from "express";
import productModel from "../models/products.models.js";

const router = Router();

// Endpoint get all products
router
  .get("/products", async (req, res) => {
    try {
      // Get the limit by query if exists
      const limit = parseInt(req.query.limit, 10);

      // Get all products
      const products = await productModel.find({});

      if (products.length === 0) {
        throw new Error("There aren't any products");
      }
      // Check if there is a limit
      if (!limit) {
        return res.status(200).send(products);
      }

      // If there is a limit, slice the array and send
      return res.status(200).send(products.slice(0, limit));
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  })

  // Endpoint to get a product by ID
  .get("/products/:pid", async (req, res) => {
    try {
      const { pid } = req.params; // Product ID
      const result = await productModel.findOne({ _id: pid });
      return res.send(result);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  })

  // Endpoint to create a new Product
  .post("/products", async (req, res) => {
    try {
      const newProduct = req.body; // New Product

      const result = await productModel.create(newProduct);
      return res.send(result);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  })

  // Endpoint to update a Product
  .put("/products/:pid", async (req, res) => {
    const { pid } = req.params; // Product ID
    const updateProduct = req.body; // Updated product
    await productModel.findByIdAndUpdate(pid, updateProduct);
    res.send({
      message: `The Product with id ${pid} was successfully updated`,
    });
  })

  // Endpoint to delete a Product
  .delete("/products/:pid", async (req, res) => {
    try {
      const { pid } = req.params; // Product ID
      const result = await productModel.findByIdAndDelete({ _id: pid });
      res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(404).send({ message: error.message });
    }
  });
export default router;
