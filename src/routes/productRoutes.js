import { Router } from 'express';
import { searchProducts } from '../controllers/productController.js';

const router = Router();

// Definimos que cuando alguien entre a /search, se ejecute searchProducts
router.get('/search', searchProducts);

export default router;