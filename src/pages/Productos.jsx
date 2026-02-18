import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await api.get('/productos');
        setProductos(data.productos || []);
        setError(null);
      } catch (err) {
        setError('Error al cargar los productos: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Productos</h1>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Productos</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>
      
      {productos.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((producto) => (
            <div 
              key={producto.id} 
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{producto.nombre}</h3>
              {producto.descripcion && (
                <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
              )}
              {producto.precio && (
                <p className="text-green-600 font-bold">
                  ${parseFloat(producto.precio).toFixed(2)}
                </p>
              )}
              {producto.stock !== undefined && (
                <p className="text-gray-500 text-sm mt-1">
                  Stock: {producto.stock}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}   
