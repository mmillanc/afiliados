import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    
    // Log de seguridad para ver en Railway si las variables están cargando
    console.log(`🔍 Buscando: "${q}" | ClientID activo: ${!!process.env.MELI_CLIENT_ID}`);
    
    const affiliateId = process.env.MELI_AFFILIATE_ID || 'nutriglar_default';

    try {
        // Intento de petición real con headers de navegador
        const response = await axios.get(`https://api.mercadolibre.com/sites/MLC/search`, {
            params: { q, limit: 12 },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Referer': 'https://www.mercadolibre.cl/'
            },
            timeout: 7000 // Tiempo límite razonable
        });

        const products = response.data.results.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail.replace("-I.jpg", "-W.jpg"),
            permalink: `${item.permalink}#affiliate_id=${affiliateId}`
        }));

        console.log('✅ Éxito: Datos reales obtenidos.');
        return res.json(products);

    } catch (error) {
        const status = error.response?.status;
        console.error(`⚠️ Error MeLi (${status || 'Timeout'}): Enviando Mocks.`);

        // Mocks equilibrados (con tus datos originales)
        const mockProducts = [
            {
                id: "mock-1",
                title: "Proteína Whey Gold Standard 2lb (Vista Previa)",
                price: 35990,
                thumbnail: "https://http2.mlstatic.com/D_NQ_NP_624177-MLC45241680653_032021-O.jpg",
                permalink: "https://www.mercadolibre.cl/#affiliate_id=" + affiliateId
            },
            {
                id: "mock-2",
                title: "Creatina Monohidratada 300g (Vista Previa)",
                price: 19990,
                thumbnail: "https://http2.mlstatic.com/D_NQ_NP_965640-MLC45241680653_032021-O.jpg",
                permalink: "https://www.mercadolibre.cl/#affiliate_id=" + affiliateId
            },
            {
                id: "mock-3",
                title: "Pre-Entreno C4 Extreme (Vista Previa)",
                price: 28500,
                thumbnail: "https://http2.mlstatic.com/D_NQ_NP_721564-MLC45241680653_032021-O.jpg",
                permalink: "https://www.mercadolibre.cl/#affiliate_id=" + affiliateId
            }
        ];
        
        return res.json(mockProducts);
    }
};