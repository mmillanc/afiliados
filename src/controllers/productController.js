import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    
    try {
        console.log(`🧪 Probando endpoint de sugerencias para: "${q}"`);

        const response = await axios.get(`https://api.mercadolibre.com/sites/MLC/autosuggest`, {
            params: { q },
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        // Logueamos la respuesta completa para ver qué nos deja pasar el WAF
        console.log("✅ Respuesta de autosuggest:", JSON.stringify(response.data));

        // Como esto es una prueba, devolvemos la data tal cual para verla en el navegador
        return res.json(response.data);

    } catch (error) {
        console.error('❌ Error en autosuggest:', error.response?.status || error.message);
        return res.status(500).json({ error: 'Fallo la prueba de autosuggest' });
    }
};