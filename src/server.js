import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de Productos
app.use('/api/products', productRoutes);

// Rutas de Autenticación
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Nutriglar activo en puerto ${PORT}`);
});