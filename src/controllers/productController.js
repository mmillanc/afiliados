import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    const affiliateId = process.env.MELI_AFFILIATE_ID || '';
    
    // IMPORTANTE: El token viene servido por el middleware
    const accessToken = req.accessToken; 

    try {
        console.log(`📡 Solicitando a MeLi oficial (Token validado) para: "${q}"`);

        const response = await axios.get(`https://api.mercadolibre.com/sites/MLC/search`, {
            params: { q, limit: 12 },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const products = response.data.results.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail.replace("-I.jpg", "-W.jpg"),
            permalink: `${item.permalink}#affiliate_id=${affiliateId}`
        }));

        console.log(`✅ ¡Búsqueda exitosa! ${products.length} productos reales.`);
        return res.json(products);

    } catch (error) {
        console.error('❌ Error API Oficial:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({ error: 'Fallo en la búsqueda' });
    }
};
