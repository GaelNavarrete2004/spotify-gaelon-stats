import React, { useState, useEffect } from 'react';
import { fetchFromSpotify } from '../../spotifyAuth';

export default function Playlists({ token }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchFromSpotify('/me/playlists', token)
      .then(data => {
        setPlaylists(data.items || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching playlists:', error);
        setLoading(false);
      });
  }, [token]);

  const handlePlaylistClick = async (playlistId) => {
    const data = await fetchFromSpotify(`/playlists/${playlistId}`, token);
    setSelectedPlaylist(data);
  };

  const handleTrackClick = (track) => {
    if (audio) {
      audio.pause();
      setAudio(null);
      setPlayingTrackId(null);
    }

    if (track.preview_url) {
      const newAudio = new Audio(track.preview_url);
      newAudio.play();
      setAudio(newAudio);
      setPlayingTrackId(track.id);

      newAudio.onended = () => {
        setPlayingTrackId(null);
      };
    }
  };

  const handlePauseClick = () => {
    if (audio) {
      audio.pause();
      setPlayingTrackId(null);
      setAudio(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-500">
        Loading playlists...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-100 mb-6">Your Playlists</h2>
        {playlists.length > 0 ? (
          <ul className="space-y-3">
            {playlists.map(playlist => (
              <li
                key={playlist.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                <span className="text-gray-200">{playlist.name}</span>
                <span className="text-gray-500 text-sm">
                  {playlist.tracks.total} tracks
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No playlists found.</p>
        )}
      </div>
      {selectedPlaylist && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            {selectedPlaylist.images[0] && (
              <img
                src={selectedPlaylist.images[0].url}
                alt={selectedPlaylist.name}
                className="w-20 h-20 rounded-lg mr-4 shadow-md"
              />
            )}
            <h2 className="text-3xl font-bold text-gray-100">
              {selectedPlaylist.name}
            </h2>
          </div>
          {selectedPlaylist.tracks.items.length > 0 ? (
            <ul className="space-y-4">
              {selectedPlaylist.tracks.items.map(item => (
                <li
                  key={item.track.id}
                  className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => handleTrackClick(item.track)}
                >
                  <img
                    src={item.track.album.images[2]?.url}
                    alt={item.track.name}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex flex-col flex-grow">
                    <span className="text-gray-200 text-lg font-medium">
                      {item.track.name}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {item.track.artists[0].name}
                    </span>
                  </div>
                  {playingTrackId === item.track.id ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePauseClick();
                      }}
                      className="text-gray-500 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                    >
                      Pause
                    </button>
                  ) : (
                    <button className="text-gray-500 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
                      Play Preview
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">This playlist is empty.</p>
          )}
        </div>
      )}
    </div>
  );
}
