import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    const ZENROWS_API_KEY = 'b3d3a8d88bb7b9743ced55b77c8d941be8f6949d';
    const affiliateId = process.env.MELI_AFFILIATE_ID || '';

    try {
        console.log(`🚀 Iniciando búsqueda con renderizado JS para: "${q}"`);

        const targetUrl = encodeURIComponent(`https://api.mercadolibre.com/sites/MLC/search?q=${q}&limit=12`);
        
        // Añadimos &js_render=true para que parezca un humano real con navegador
        const url = `https://api.zenrows.com/v1/?apikey=${ZENROWS_API_KEY}&url=${targetUrl}&js_render=true`;

        const response = await axios.get(url);

        if (response.data && response.data.results) {
            const products = response.data.results.map(item => ({
                id: item.id,
                title: item.title,
                price: item.price,
                thumbnail: item.thumbnail.replace("-I.jpg", "-W.jpg"),
                permalink: `${item.permalink}#affiliate_id=${affiliateId}`
            }));

            console.log(`✅ ¡POR FIN! ${products.length} productos reales obtenidos.`);
            return res.json(products);
        }

        throw new Error('Respuesta vacía o mal formada');

    } catch (error) {
        // Log para ver si ZenRows nos dice algo más
        console.error('❌ Error detallado:', error.response?.data || error.message);
        
        return res.json([
            { id: 'err', title: 'Refrescando conexión con MeLi...', price: 0, thumbnail: '', permalink: '#' }
        ]);
    }
};
