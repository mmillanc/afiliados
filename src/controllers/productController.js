import axios from 'axios';

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    const affiliateId = process.env.MELI_AFFILIATE_ID || 'nutriglar';

    try {
        console.log(`📡 Intentando consulta REAL a MeLi para: "${q}"`);

        // Intentamos la búsqueda en el sitio de Chile (MLC)
        // Usamos una URL de API directa que a veces tiene menos restricciones
        const response = await axios.get(`https://api.mercadolibre.com/sites/MLC/search`, {
            params: { 
                q: q, 
                limit: 12,
                sort: 'relevance' // Pedimos por relevancia para parecer una búsqueda humana
            },
            headers: {
                // Simulamos un navegador muy específico
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'es-CL,es;q=0.9',
                'Connection': 'keep-alive'
            },
            timeout: 8000
        });

        // Si llegamos aquí y hay resultados, MeLi NO nos bloqueó
        if (response.data.results && response.data.results.length > 0) {
            const products = response.data.results.map(item => ({
                id: item.id,
                title: item.title,
                price: item.price,
                thumbnail: item.thumbnail.replace("-I.jpg", "-W.jpg"),
                permalink: `${item.permalink}#affiliate_id=${affiliateId}`
            }));

            console.log(`✅ ¡ÉXITO! Se obtuvieron ${products.length} productos reales.`);
            return res.json(products);
        } else {
            throw new Error('No se encontraron resultados reales');
        }

    } catch (error) {
        console.error(`❌ Falló la búsqueda real (Status: ${error.response?.status}). Activando Mocks.`);

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