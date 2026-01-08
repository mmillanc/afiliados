import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    const affiliateId = process.env.MELI_AFFILIATE_ID || '';
    
    try {
        console.log(`📡 Solicitando Token oficial para buscar: "${q}"`);

        // 1. Obtener Token de Aplicación (Client Credentials Flow)
        const tokenResponse = await axios.post('https://api.mercadolibre.com/oauth/token', {
            grant_type: 'client_credentials',
            client_id: process.env.MELI_CLIENT_ID,
            client_secret: process.env.MELI_CLIENT_SECRET
        });

        const accessToken = tokenResponse.data.access_token;

        // 2. Realizar búsqueda REAL usando el Token
        const searchResponse = await axios.get(`https://api.mercadolibre.com/sites/MLC/search`, {
            params: { q, limit: 12 },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const products = searchResponse.data.results.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail.replace("-I.jpg", "-W.jpg"),
            permalink: `${item.permalink}#affiliate_id=${affiliateId}`
        }));

        console.log(`✅ ¡ÉXITO! ${products.length} productos reales obtenidos con Token.`);
        return res.json(products);

    } catch (error) {
        console.error('❌ Error API Oficial:', error.response?.data || error.message);
        
        // Mocks por si falla la API (aquí tus 3 productos de siempre)
        return res.json([
            {
                id: "mock-1",
                title: "Proteína Whey Gold Standard 2lb (Modo Offline)",
                price: 35990,
                thumbnail: "https://http2.mlstatic.com/D_NQ_NP_624177-MLC45241680653_032021-O.jpg",
                permalink: "https://www.mercadolibre.cl/#affiliate_id=" + affiliateId
            }
        ]);
    }
};