import express from 'express';
import productModel from '../dao/models/product.model.js';
import cartModel from '../dao/models/cart.model.js';




const router = express.Router();

router.get('/realtimeproducts', async (req, res) => {
    try {

        let products = await productModel.find();      
        products = products.map(product => ({
            _id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnails: product.thumbnails,
            code: product.code,
            stock: product.stock,
            category: product.category,
            status: product.status
        }));
        console.log(products) 
        res.render('realTimeProducts',  {
            products: products,
            title: 'Real time products',
            useWS: true,
            scripts: ['realtime.js']
    
        });
    } catch (error) {
        console.error("We can't show the products right now", error);
        res.status(500).send('Error while loading the products');
    }
});

router.get('/products', async (req, res) => {
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

        const hasProducts = result.docs.length > 0;


        res.render('index', {
            title: 'Products',
            products: result.docs,
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink,
            isValid: !(page <= 0 || page > result.totalPages),
            hasProducts,
            scripts: ['index.js']
        });
    } catch (error) {
        console.error("We can't show the products right now", error);
        res.status(500).send('Error while loading the products');
    }
});


router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    //por el momento estoy haciendo pruebas con cart id: 66affd4bc723a31ad3519e85 hardcodeado en la lógica del botón de agregar al carrito
    try {
        let result = await cartModel.findOne({_id:cid}).populate('products.productId').lean();
        if (!result) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        let cartLength = result.products.length 
        let emptyCart = cartLength === 0;

        res.render('cart', { 
            title: 'Cart',
            cart: result.products,
            emptyCart,
            scripts: ['cart.js']
        });
    } catch (error) {
        console.error('Error getting cart by ID:', error);
        res.status(500).json({ error: 'cart not found' });
    }
   
  })


  



export default router;
