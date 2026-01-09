import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    const ZENROWS_API_KEY = 'b3d3a8d88bb7b9743ced55b77c8d941be8f6949d';
    const affiliateId = process.env.MELI_AFFILIATE_ID || '';

    try {
        console.log(`🚀 Usando túnel inteligente para buscar: "${q}"`);

        // 1. Preparamos la URL de Mercado Libre (Codificada para que no de error 400)
        const targetUrl = encodeURIComponent(`https://api.mercadolibre.com/sites/MLC/search?q=${q}&limit=12`);
        
        // 2. Construimos la URL final de ZenRows
        const url = `https://api.zenrows.com/v1/?apikey=${ZENROWS_API_KEY}&url=${targetUrl}`;

        // 3. Hacemos la petición a través del túnel
        const response = await axios.get(url);

        // 4. Procesamos los resultados
        const products = response.data.results.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail.replace("-I.jpg", "-W.jpg"),
            permalink: `${item.permalink}#affiliate_id=${affiliateId}`
        }));

        console.log("✅ ¡POR FIN! Datos reales obtenidos vía túnel.");
        return res.json(products);

    } catch (error) {
        // Log detallado para saber por qué falló
        console.error('❌ El túnel falló:', error.response?.data || error.message);
        
        return res.json([
            { id: 'error', title: 'Error al conectar con el servidor real', price: 0, thumbnail: '', permalink: '#' }
        ]);
    }
};