import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    const ZENROWS_API_KEY = 'b3d3a8d88bb7b9743ced55b77c8d941be8f6949d';
    const affiliateId = process.env.MELI_AFFILIATE_ID || '';

    try {
        console.log(`📡 Buscando como humano real para: "${q}"`);

        // CAMBIO CLAVE: Vamos a la URL de búsqueda del sitio, NO a la API
        const targetUrl = encodeURIComponent(`https://listado.mercadolibre.cl/${q}`);
        
        // Usamos premium_proxy y antibot para saltar el WAF
        const url = `https://api.zenrows.com/v1/?apikey=${ZENROWS_API_KEY}&url=${targetUrl}&premium_proxy=true&antibot=true`;

        const response = await axios.get(url);

        // Mercado Libre guarda los resultados en un objeto JSON dentro del HTML o los devuelve directo
        // Si ZenRows detecta que es una petición de datos, nos dará el JSON.
        // Si nos da el HTML, este mapeo fallará, pero vamos a probar si el proxy premium lo logra.
        
        if (response.data && response.data.results) {
            const products = response.data.results.map(item => ({
                id: item.id,
                title: item.title,
                price: item.price,
                thumbnail: item.thumbnail?.replace("-I.jpg", "-W.jpg"),
                permalink: `${item.permalink}#affiliate_id=${affiliateId}`
            }));

            console.log(`✅ ¡LO LOGRAMOS! ${products.length} productos reales con Proxy Premium.`);
            return res.json(products);
        }

        throw new Error('MeLi respondió pero no envió resultados.');

    } catch (error) {
        console.error('❌ Error de conexión:', error.response?.status || error.message);
        
        // Si todo falla, enviamos un mensaje claro al Front
        return res.json([
            { id: 'error', title: 'Conectando con el catálogo...', price: 0, thumbnail: '', permalink: '#' }
        ]);
    }
};