import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleCallback } from './controllers/authController.js';
import { searchProducts } from './controllers/productController.js';
import { ensureValidToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de Autenticación
app.get('/api/auth/callback', handleCallback);

// Rutas de Negocio (Protegidas por el middleware de token)
app.get('/api/products/search', ensureValidToken, searchProducts);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API Nutriglar Afiliados lista en puerto ${PORT}`);
});
