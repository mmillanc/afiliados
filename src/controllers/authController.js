import axios from 'axios';
import { saveTokens } from '../services/tokenService.js';
import dotenv from 'dotenv';

dotenv.config();

export const handleCallback = async (req, res) => {
    const { code } = req.query; // Este es el famoso TG (Authorization Code)

    if (!code) {
        return res.status(400).send('Error: No se recibió el código de autorización.');
    }

    try {
        console.log('🔄 Intercambiando código por tokens...');
        
        const response = await axios.post('https://api.mercadolibre.com/oauth/token', {
            grant_type: 'authorization_code',
            client_id: process.env.MELI_CLIENT_ID,
            client_secret: process.env.MELI_CLIENT_SECRET,
            code: code,
            redirect_uri: process.env.MELI_REDIRECT_URI
            }, {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // MeLi a veces prefiere este formato
        }
        });

        // Guardamos los tokens en el JSON
        await saveTokens(response.data);

        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #00a650;">✅ ¡Autenticación Exitosa!</h1>
                <p>Los tokens se han guardado en <b>tokens.json</b>.</p>
                <p>Ya puedes cerrar esta pestaña y empezar a buscar productos.</p>
            </div>
        `);
    } catch (error) {
        console.error('❌ Error en el intercambio:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Fallo al obtener tokens',
            details: error.response?.data
        });
    }
};
