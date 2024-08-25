import {Router} from 'express';
import mongoose from'mongoose'
import productModel from '../dao/models/product.model.js';
import cartModel from '../dao/models/cart.model.js'

const router = Router();


router.get('/', async (req, res) => {
  let { limit, page, sort, category, status } = req.query;
    if (!page) page = 1;
    if (!limit) limit = 10;

    let filter = {};

    if (category) {
        filter.category = category;
    }
    if (status !== undefined) {
        filter.status = status === 'true'; 
    }

    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
        lean: true
    };

    try {
      const result = await productModel.paginate(filter, options);
      const queryObj = {};
      if (category) queryObj.category = category;
      if (status) queryObj.status = status;
      if (sort) queryObj.sort = sort;
      if (limit) queryObj.limit = limit;

      const buildQueryString = (page) => {
          return `?page=${page}&${new URLSearchParams(queryObj).toString()}`;
      };

      result.prevLink = result.hasPrevPage ? buildQueryString(result.prevPage) : null;
      result.nextLink = result.hasNextPage ? buildQueryString(result.nextPage) : null;

      res.send({ result: "success", payload: { ...result, prevLink: result.prevLink, nextLink: result.nextLink } });
    } catch (error) {
        console.error("Error while retrieving the list of products: ", error);
        res.status(500).json({ error: "Error while retrieving products" });
    }
});

router.post('/', async (req, res) => {
  try {
      let { title, description, code, price, stock, category, thumbnails, status } = req.body;
      console.log(req.body);
      if (!title || !description || !code || !price || stock === undefined || stock === null|| !category ) {
        return res.send({status:"error", error:"All fields are mandatory, except thumbnails."});
    }
      if (typeof status === 'undefined') {
      return res.send({status:"error", error:"The status field is mandatory."});
    }
      let result = await productModel.create({title, description, code, price, stock, category, thumbnails, status});
      res.send({result: "success", payload: result});
  } catch (error) {
      console.error('Error  while creating a new product:', error);
      res.status(500).json({ error: 'Error while creating product' });
  }
})

router.put("/:pid", async (req, res) => {
  try {
    let productId = req.params.pid;
    let allowedFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
      "thumbnails",
      "status"
    ];

    const updatedFields = {};

    for (const key in req.body) {
      if (key !== "id" && allowedFields.includes(key)) {
        updatedFields[key] = req.body[key];
      } else if (key !== "id") {
        return res
          .status(400)
          .json({ error: `Field '${key}' is not allowed for product update` });
      }
    }

    let result = await productModel.updateOne({_id:productId}, updatedFields)
    res.send({result: "success", payload: result});
   
  } catch (error) {
    console.error("Error while updating the product:", error);
    res.status(500).json({ error: 'Error while updating product' });
  }
});


router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
      let result = await productModel.deleteOne({_id:productId});
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      //para eliminar el producto de los carritos que lo tengan y no quede ese error de producto fantasma con id null
      await cartModel.updateMany(
        { 'products.productId': productId },
        { $pull: { products: { productId: productId } } }
      );
      res.send({result: "success", payload: result});
  } catch (error) {
      console.error('Error while deleting the product', error);
      res.status(500).json({ error: 'Error while deleting product' });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID. Enter a valid ID" });
    }
    let result = await productModel.findOne({_id:productId});
    if (!result) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.send({result: "success", payload: result});
    } catch (error) {
      console.error('Error while fetching the product', error);
      res.status(500).json({ error: 'Error while fetching product' });
      
    }
});






export default router;
