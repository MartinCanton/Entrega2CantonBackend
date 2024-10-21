import {Router} from 'express';
import ProductsController from '../controllers/products.controller.js';
import { passportCall, authorization } from '../middlewares/auth.js';

const router = Router();
const productsController = new ProductsController();


router.get('/', productsController.getProducts);
router.get("/:pid", productsController.getProductById);
router.post('/', passportCall('jwt'), authorization('admin'), productsController.createProduct);
router.put("/:pid", passportCall('jwt'), authorization('admin'), productsController.updateProduct);
router.delete('/:pid', passportCall('jwt'), authorization('admin'), productsController.deleteProduct);


export default router;
