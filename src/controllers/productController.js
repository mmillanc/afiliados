import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    const ZENROWS_API_KEY ='b3d3a8d88bb7b9743ced55b77c8d941be8f6949d'; // Ponla en tus variables de Railway

    try {
        console.log(`🚀 Usando túnel inteligente para buscar: "${q}"`);

        // Esta URL mágica hace que la petición parezca venir de un PC real en Chile
        const url = `https://api.zenrows.com/v1/?apikey=${ZENROWS_API_KEY}&url=https://api.mercadolibre.com/sites/MLC/search?q=${encodeURIComponent(q)}&limit=12`;

        const response = await axios.get(url);

        const products = response.data.results.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail.replace("-I.jpg", "-W.jpg"),
            permalink: `${item.permalink}#affiliate_id=${process.env.MELI_AFFILIATE_ID}`
        }));

        console.log("✅ ¡POR FIN! Datos reales obtenidos vía túnel.");
        return res.json(products);

    } catch (error) {
        console.error('❌ El túnel también falló:', error.message);
        return res.json([{ id: 'error', title: 'Error de conexión real', price: 0 }]);
    }
};