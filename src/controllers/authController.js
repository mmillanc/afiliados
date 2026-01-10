import axios from 'axios';
import { saveTokens } from '../services/tokenService.js';
import dotenv from 'dotenv';

dotenv.config();

export const handleCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Error: No se recibió el código.');
    }

    try {
        console.log('🔄 Intercambiando código por tokens...');

        // Usamos URLSearchParams para asegurar el formato correcto
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', process.env.MELI_CLIENT_ID);
        params.append('client_secret', process.env.MELI_CLIENT_SECRET);
        params.append('code', code);
        params.append('redirect_uri', process.env.MELI_REDIRECT_URI); // <--- ESTE ES EL QUE RECLAMA

        const response = await axios.post('https://api.mercadolibre.com/oauth/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });

        await saveTokens(response.data);
        console.log('✅ Tokens guardados correctamente');

        res.send('<h1>✅ Autenticación Exitosa</h1>');
    } catch (error) {
        console.error('❌ Error en el intercambio:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Fallo al obtener tokens',
            details: error.response?.data
        });
        }
        try {
        const accessToken = response.data.access_token;
        console.log('📡 Validando identidad para activar APP...');
        await axios.get('https://api.mercadolibre.com/users/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log('✅ App activada en el ecosistema de MeLi');
        } catch (vError) {
        console.error('⚠️ No se pudo activar la app automáticamente:', vError.message);
}
};
