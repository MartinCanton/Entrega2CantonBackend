import { Router } from 'express';
import CartsController from "../controllers/carts.controller.js";
import { passportCall, authorization } from '../middlewares/auth.js';

const router = Router();
const cartsController = new CartsController();


router.post('/', passportCall('jwt'), authorization('user'), cartsController.createCart);

router.post('/:cid/products/:pid', passportCall('jwt'), authorization('user'), cartsController.addProductToCart);

router.get('/:cid', passportCall('jwt'), authorization('user'), cartsController.getCartById);

router.put('/:cid/products/:pid', passportCall('jwt'), authorization('user'), cartsController.updateProductQuantity);

router.put('/:cid', passportCall('jwt'), authorization('user'), cartsController.updateCart);

router.delete('/:cid/products/:pid', passportCall('jwt'), authorization('user'), cartsController.deleteProductFromCart);

router.delete('/:cid', passportCall('jwt'), authorization('user'), cartsController.emptyCart);

router.post('/:cid/purchase', passportCall('jwt'), authorization('user'), cartsController.completePurchase);

export default router;
