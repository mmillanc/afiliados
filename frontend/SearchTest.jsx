import React, { useState } from 'react';

// Reutilizamos tu componente pero apuntando directo al permalink por ahora
export function AffiliateProductCard({ product }) {
  if (!product) return null;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square w-full flex items-center justify-center bg-white p-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-sm font-semibold line-clamp-2 h-10">
          {product.title}
        </h3>

        <p className="mb-4 text-lg font-bold text-blue-600">
          ${product.price?.toLocaleString("es-CL")}
        </p>

        {/* El link ya viene con tu ID de afiliado desde el backend */}
        <a
          href={product.permalink}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="mt-auto inline-flex items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
        >
          Ver en Mercado Libre
        </a>
      </div>
    </article>
  );
}

export default function SearchProductsPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Llamada a tu backend de Node.js
      const response = await fetch(`https://afiliados-production-0d15.up.railway.app/api/products/search?q=${query}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error buscando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Buscador Nutriglar
        </h1>

        {/* Barra de Búsqueda */}
        <form onSubmit={handleSearch} className="mb-10 flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: Proteína Whey..."
            className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* Grid de Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <AffiliateProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-10">
            Escribe algo para empezar a buscar...
          </p>
        )}
      </div>
    </div>
  );
}
