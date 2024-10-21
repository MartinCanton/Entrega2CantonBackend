import express from 'express';
import productModel from '../models/product.model.js';
import cartModel from '../models/cart.model.js';
import { isAuthenticated, isNotAuthenticated, passportCall, authorization} from '../middlewares/auth.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

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
        console.error("No podemos mostrar los productos", error);
        res.status(500).send('Error al cargar los productos');
    }
});


router.get('/cart', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).render('error401', { message: 'Inicia sesion para ver tus datos', title: "No estas logueado" });
          }
        let user = req.user
        if (user.toObject) {
            user = user.toObject();
        }
        let cartId  = user.cart;
        console.log(cartId)
        let result = await cartModel.findOne({_id:cartId}).populate('products.productId').lean();
        if (!result) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }
        let cartLength = result.products.length 
        let emptyCart = cartLength === 0;

        res.render('cart', { 
            title: 'Cart',
            cart: result.products,
            emptyCart,
            scripts: ['cart.js'],
            cartId 
        });
    } catch (error) {
        console.error('Error al buscar un carrito por id:', error);
        res.status(500).json({ error: 'Carrito no encontrado' });
    }
   
  })

  
router.get('/login', isNotAuthenticated, (req, res) => {

    res.render('login', {
        title: 'Login',
        scripts: ['login.js'],
       });
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register', {
        title: 'Register',
        scripts: ['register.js']
});
})

router.get('/profile', passportCall('jwt', { session: false }), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).render('error401', { message: 'Inicia sesion para ver tus datos', title: "401 No estas logueado" });
      }
  
      let user = req.user;
      if (user.toObject) {
        user = user.toObject();
      }
  
      res.render('profile', {
        user,
        title: 'Profile',
        scripts: ['profile.js']
      });
    } catch (error) {
      res.status(500).send({ error: 'Error al obtener el perfil' });
    }
  });
  
  router.get('/error401', (req, res) => {
    res.status(401).render('error401', { message: 'Inicia sesion para ver tus datos', title: "No estas logueado" });
  });


router.get('/manageproducts', authorization('admin'), async (req, res) => {
    try {
        res.render('manageProducts', {
            title: 'Manage Products',
            scripts: ['manageProducts.js'],
        });
    } catch (error) {
        res.status(500).send({ error: 'Error al acceder al Manage Products.'});
    }
}); 

export default router;
