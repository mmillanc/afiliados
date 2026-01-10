import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    const affiliateId = process.env.MELI_AFFILIATE_ID || '';
    
    // REEMPLAZA ESTO CON LA URL DE TU WORKER
    const CLOUDFLARE_WORKER_URL = 'https://tu-worker.tu-usuario.workers.dev';

    try {
        console.log(`🚀 Saltando bloqueo MeLi vía Cloudflare para: "${q}"`);

        // Llamamos al Worker en lugar de a MeLi directamente
        const response = await axios.get(`${CLOUDFLARE_WORKER_URL}?q=${encodeURIComponent(q)}`);

        // Estructuramos los productos como antes
        const products = response.data.results.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail.replace("-I.jpg", "-W.jpg"),
            permalink: `${item.permalink}#affiliate_id=${affiliateId}`
        }));

        console.log(`✅ ¡ÉXITO! ${products.length} productos obtenidos vía Cloudflare.`);
        return res.json(products);

    } catch (error) {
        console.error('❌ Error en el puente Cloudflare:', error.message);
        return res.status(500).json([]);
    }
};
