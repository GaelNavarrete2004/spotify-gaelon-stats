import React, { useState, useEffect } from 'react';
import { getAuthUrl, fetchFromSpotify } from './spotifyAuth';
import Playlists from './components/Playlist/Playlist';
import Discovery from './components/Discovery/Discovery';
import RecentlyPlayed from './components/Recently Played/RecentlyPlayed';
import Statistics from './components/Stats/Stats';

export default function App() {
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('playlists');
  const [error, setError] = useState(null);

  // Verifica si hay un token en el hash de la URL
  useEffect(() => {
    const hash = window.location.hash;
    const storedToken = localStorage.getItem('spotifyAccessToken');

    // Si ya tenemos un token en localStorage, lo usamos directamente
    if (storedToken) {
      setToken(storedToken);
      return;
    }

    // Si encontramos el token en la URL, lo guardamos en localStorage
    if (hash) {
      const token = new URLSearchParams(hash.replace('#', '?')).get('access_token');
      if (token) {
        localStorage.setItem('spotifyAccessToken', token);
        setToken(token);
      } else {
        setError('Error: Token de acceso no encontrado');
      }
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('spotifyAccessToken');
    setToken(null);
    window.location.hash = ''; // Limpia el hash de la URL
  };

  // Si hay un error, mostramos un mensaje
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  // Si no hay token, redirigimos al usuario a la página de login de Spotify
  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <a href={getAuthUrl()} className="px-6 py-3 text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors">
          Iniciar sesión con Spotify
        </a>
      </div>
    );
  }

  // Si ya tenemos el token, renderizamos la interfaz de usuario
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => setActiveTab('playlists')}
              className={`px-4 py-2 rounded ${activeTab === 'playlists' ? 'bg-green-500' : 'hover:bg-gray-700'}`}
            >
              Playlists
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('discovery')}
              className={`px-4 py-2 rounded ${activeTab === 'discovery' ? 'bg-green-500' : 'hover:bg-gray-700'}`}
            >
              Discovery
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('recentlyplayed')}
              className={`px-4 py-2 rounded ${activeTab === 'recentlyplayed' ? 'bg-green-500' : 'hover:bg-gray-700'}`}
            >
              Recently Played
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-2 rounded ${activeTab === 'statistics' ? 'bg-green-500' : 'hover:bg-gray-700'}`}
            >
              Stats
            </button>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </nav>
      <main className="container mx-auto mt-8 p-4">
        {activeTab === 'playlists' && <Playlists token={token} />}
        {activeTab === 'discovery' && <Discovery token={token} />}
        {activeTab === 'recentlyplayed' && <RecentlyPlayed token={token} />}
        {activeTab === 'statistics' && <Statistics token={token} />}
      </main>
    </div>
  );
}
