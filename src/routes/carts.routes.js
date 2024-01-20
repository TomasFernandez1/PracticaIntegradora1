import { Router } from "express";
import cartModel from "../models/carts.models.js";

const router = Router();

// Endpoint to create a cart
router
  .post("/carts", async (req, res) => {
    try {
      await cartModel.create({ products: [] });
      res.status(200).send("Cart created");
    } catch (err) {
      res.status(500).send({ Message: err.message });
    }
  })

  // Endpoint to Get the list of products from a cart using ID
  .get("/carts/:cid", async (req, res) => {
    try {
      const { cid } = req.params; // ID del carrito
      const cart = await cartModel.findOne({ _id: cid });

      if (cart) {
        res.status(200).send(cart);
      } else {
        res.status(404).send({ Message: "Cart not found" });
      }
    } catch (error) {
      res.status(500).send({ Message: error.message });
    }
  })

  // Endpoint to add a product to the cart using ID cart and ID product
  .post("/carts/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await cartModel.findById(cid);
      const productIndex = cart.products.findIndex(
        (p) => p.product && p.product.id === pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      const result = await cartModel.findByIdAndUpdate(cid, cart);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ Message: error.message });
    }
  });

export default router;
