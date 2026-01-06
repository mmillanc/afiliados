import axios from 'axios';
import { getTokens, saveTokens } from '../services/tokenService.js';

export const ensureValidToken = async (req, res, next) => {
    const tokens = await getTokens();

    if (!tokens) {
        return res.status(401).json({ error: 'No hay tokens registrados. Autentícate de nuevo.' });
    }

    // Verificamos si expira en menos de 5 minutos (margen de seguridad)
    const isExpired = Date.now() > (tokens.expires_at - 300000);

    if (isExpired) {
        console.log('🔄 Access Token expirado. Usando Refresh Token...');
        try {
            const response = await axios.post('https://api.mercadolibre.com/oauth/token', {
                grant_type: 'refresh_token',
                client_id: process.env.MELI_CLIENT_ID,
                client_secret: process.env.MELI_CLIENT_SECRET,
                refresh_token: tokens.refresh_token
            }, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const newTokens = await saveTokens(response.data);
            req.accessToken = newTokens.access_token;
            console.log('✅ Token refrescado automáticamente');
        } catch (error) {
            console.error('❌ Error fatal al refrescar token:', error.response?.data || error.message);
            return res.status(401).json({ error: 'La sesión de MeLi caducó. Re-autenticación manual requerida.' });
        }
    } else {
        req.accessToken = tokens.access_token;
    }

    next();
};
