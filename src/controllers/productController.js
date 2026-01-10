import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    const affiliateId = process.env.MELI_AFFILIATE_ID || '';

    try {
        console.log(`📡 Intento de búsqueda pública (Sin Token) para: "${q}"`);

        // Hacemos la petición SIN el header de Authorization
        const response = await axios.get(`https://api.mercadolibre.com/sites/MLC/search`, {
            params: { q, limit: 12 },
            headers: {
                // Engañamos al sistema pareciendo un navegador real
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'es-CL,es;q=0.9'
            }
        });

        const products = response.data.results.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail.replace("-I.jpg", "-W.jpg"),
            permalink: `${item.permalink}#affiliate_id=${affiliateId}`
        }));

        console.log(`✅ ÉXITO PÚBLICO: ${products.length} productos obtenidos.`);
        return res.json(products);

    } catch (error) {
        console.error('❌ Error en Búsqueda Pública:', error.response?.data || error.message);
        
        // Si esto también da 403, significa que Railway está bloqueado por IP
        return res.status(error.response?.status || 500).json([]);
    }
};
