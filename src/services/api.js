const API_URL = "http://localhost:4000/api";

export const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { 
          'Authorization': token ?  `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error en GET:", error);
      throw error;
    }
  },

  
  post: async (endpoint, body) => {
    const token = localStorage.getItem('token');
    try {
      const url = `${API_URL}${endpoint}`;
      console.log('POST a:', url);
      console.log('Con datos:', body);
      console.log('Token:', token ? 'Presente' : 'Ausente');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ?  `Bearer ${token}` : ''
        },
        body: JSON.stringify(body)
      });
      
      console.log('Respuesta status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error en POST:", error);
      throw error;
    }
  }
};