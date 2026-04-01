import { useEffect, useState } from 'react';
import { api } from '../services/api';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ShoppingBag, Loader, AlertCircle, Plus, X, MessageCircle, Twitter, Share2 } from 'lucide-react';

// Corrección para el ícono de los marcadores en Leaflet usando Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen_url: '',
    youtube_id: '',
    latitud: '',
    longitud: '' 
  });
  const [submitLoading, setSubmitLoading] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      console.log('Enviando datos:', formData);
      const newProduct = await api.post('/productos/crear', formData);
      
      console.log('Producto creado:', newProduct);
      setProductos(prev => [...prev, newProduct]);
      
    //reseteamos el form 
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagen_url: '',
        youtube_id: '',
        latitud: '',
        longitud: ''
      });
      
      // Ocultar el formulario
      setShowForm(false);
      alert('Producto creado exitosamente');
    } catch (err) {
      setError('Error al crear el producto: ' + err.message);
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const compartirWhatsApp = (producto) => {
    // 1. Redactamos la carta con los datos reales de la BD
    const mensaje = `¡Mira lo que encontré en la tienda!\n\n${producto.nombre}\n$${producto.precio}\n\n¿Te interesa?`;
   
    // 2. Empacamos el mensaje para que la URL no explote
    const textoCodificado = encodeURIComponent(mensaje);
   
    // 3. Enviamos al usuario a la oficina de correos (Abre pestaña nueva)
    window.open(`https://api.whatsapp.com/send?text=${textoCodificado}`, '_blank');
  };

  const compartirTwitter = (producto) => {
    const mensaje = `Increíble producto en la tienda: ${producto.nombre} por solo $${producto.precio}. ¡Tienen que verlo! #InventarioPro`;
    const textoCodificado = encodeURIComponent(mensaje);
   
    window.open(`https://twitter.com/intent/tweet?text=${textoCodificado}`, '_blank');
  };

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Inventario</h1>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {showForm ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {/* Formulario de creación */}
      {showForm && (
        <div className="bg-white border rounded-lg p-6 shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Crear Nuevo Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción del producto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  ID o URL de YouTube
                </label>
                <input
                  type="text"
                  name="id_youtube"
                  value={formData.id_youtube}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ID de YouTube (ej: dQw4w9WgXcQ)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Latitud
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitud"
                  value={formData.latitud}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 19.432608"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Longitud
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitud"
                  value={formData.longitud}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: -99.133209"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                {submitLoading ? 'Guardando...' : 'Guardar Producto'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {productos.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((producto) => {
            const videoId = producto.youtube_id 
              ? (producto.youtube_id.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\n]{11})/) || [])[1] || producto.youtube_id
              : null;

            return (
            <div 
              key={producto.id} 
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {videoId ? (
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={producto.nombre}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img 
                  src={producto.imagen_url || 'https://via.placeholder.com/400x200?text=Sin+Imagen'}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}  
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
              {(producto.latitud && producto.longitud) && (
                <div className="mt-4">
                  <p className="text-gray-500 font-semibold text-sm mb-2">Ubicación:</p>
                  <div style={{ height: "200px", width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}>
                    <MapContainer 
                      center={[parseFloat(producto.latitud), parseFloat(producto.longitud)]} 
                      zoom={13} 
                      scrollWheelZoom={false} 
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[parseFloat(producto.latitud), parseFloat(producto.longitud)]}>
                        <Popup>
                          {producto.nombre}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              )}

              {/* NUEVO: Barra de Redes Sociales */}
              <div className="pt-3 flex justify-between items-center bg-slate-50 -mx-4 -mb-4 px-4 py-3 rounded-b-xl border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Share2 size={14} /> Compartir:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => compartirWhatsApp(producto)}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition shadow-sm"
                    title="Compartir en WhatsApp"
                  >
                    <MessageCircle size={16} />
                  </button>
                  <button
                    onClick={() => compartirTwitter(producto)}
                    className="bg-black hover:bg-slate-800 text-white p-2 rounded-full transition shadow-sm"
                    title="Compartir en X (Twitter)"
                  >
                    <Twitter size={16} />
                  </button>
                </div>
              </div>

            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}   
