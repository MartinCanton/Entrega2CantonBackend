import { Router } from 'express';
import cartModel from '../dao/models/cart.model.js';
import productModel from '../dao/models/product.model.js'
import mongoose from 'mongoose';

const router = Router();

// Crea carrito nuevo
router.post('/', async (req, res) => {
  try {
    let result = await cartModel.create({ products: [] });
    res.send({ result: "success", payload: result });
  } catch (error) {
    console.error('Error while creating a new cart:', error);
    res.status(500).send({ result: "error", payload: error });
  }
});

// Agrega producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  let { quantity } = req.body;

  quantity = parseInt(quantity) || 1;

  quantity = (quantity !== undefined && !isNaN(parseInt(quantity)) && parseInt(quantity) > 0) 
  ? parseInt(quantity) 
  : 1;
  try {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ result: "error", message: "Invalid product ID. Please provide a valid ID." });
    }
    let cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ result: "error", message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
    
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId: pid, quantity });
    }

    await cart.save();
    res.send({ result: "success", payload: cart });
  } catch (error) {
    console.error('Error while adding product to cart:', error);
    res.status(500).send({ result: "error", payload: error });
  }
});

// Obtiene carrito por ID
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({ result: "error", message: "Invalid cart ID. Please provide a valid ID." });
    }
    let cart = await cartModel.findOne({ _id: cid }).populate('products.productId').lean();
    if (!cart) {
      return res.status(404).json({ error: "cart not found" });
    }
    res.send({ result: "success", payload: cart });
  } catch (error) {
    console.error('Error while fetching a cart:', error);
    res.status(500).send({ result: "error", payload: error });
  }
});


// Actualiza cantidad de producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ result: "error", message: "Invalid product ID. Please provide a valid ID." });
    }

    let cart = await cartModel.findOne({ _id: cid, 'products.productId': pid });
    if (!cart) {
      return res.status(404).send({ result: "error", message: "Product not found in cart." });
    }

    let result = await cartModel.updateOne(
      { _id: cid, 'products.productId': pid },
      { $set: { 'products.$.quantity': quantity } }
    );
    res.send({ result: "success", payload: result });
  } catch (error) {
    console.error('Error while updating a cart:', error);
    res.status(500).send({ result: "error", payload: error });
  }
});

router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    return res.status(400).send({ result: "error", message: "Products array is required and must be an array" });
  }

  try {
    let cart = await cartModel.findOne({ _id: cid })
    if (!cart) {
      return res.status(404).send({ result: "error", message: "Cart not found" });
    }

    const productIds = products.map(product => product.productId);
    const existingProducts = await productModel.find({ _id: { $in: productIds } }).lean();

    if (existingProducts.length !== productIds.length) {
      return res.status(404).send({ result: "error", message: "One or more products not found" });
    }

    cart.products = products;
    await cart.save();

    const updatedCart = await cartModel.findById(cid).populate('products.productId');

    res.send({ result: "success", payload: updatedCart });

  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).send({ result: "error", message: error.message });
  }
});


// Elimina producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ result: "error", message: "Invalid product ID. Please provide a valid ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({ result: "error", message: "Invalid cart ID. Please provide a valid ID." });
    }
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ result: "error", message: "Cart not found." });
    }
    cart.products = cart.products.filter(item => item.productId.toString() !== pid);
    
    await cart.save();
    res.send({ result: "success", payload: cart });
  } catch (error) {
    res.status(500).send({ result: "error", payload: error });
  }
});

// Vacía carrito
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({ result: "error", message: "Invalid cart ID. Please provide a valid ID." });
    }
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ result: "error", message: "Cart not found." });
    }
    cart.products = [];
    await cart.save();
    res.send({ result: "success", payload: cart });
  } catch (error) {
    console.error('Error while emptying the cart:', error);
    res.status(500).send({ result: "error", payload: error });
  }
});

export default router;
