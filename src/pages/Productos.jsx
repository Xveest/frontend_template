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

   