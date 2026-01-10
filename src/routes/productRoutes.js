import { Router } from 'express';
import { searchProducts } from '../controllers/productController.js';
import { ensureValidToken } from '../middleware/authMiddleware.js'; // Importamos el guardián

const router = Router();

// Ahora la ruta tiene DOS pasos: 1. Validar Token, 2. Buscar
router.get('/search', ensureValidToken, searchProducts);

export default router;