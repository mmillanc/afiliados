import { Router } from 'express';
import { handleCallback } from '../controllers/authController.js'; // Ajusta la ruta si tu controller tiene otro nombre

const router = Router();

// Esta es la ruta que configuraste en MeLi como Redirect URI
router.get('/callback', handleCallback);

export default router;
