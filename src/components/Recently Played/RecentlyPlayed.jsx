import React, { useState, useEffect } from "react";
import { fetchFromSpotify } from "../../spotifyAuth";

export default function RecentlyPlayed({ token }) {
  const [recentTracks, setRecentTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewAudio, setPreviewAudio] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [playlistMenuVisible, setPlaylistMenuVisible] = useState(false);

  useEffect(() => {
    fetchAllRecentTracks();
    fetchUserPlaylists();
  }, [token]);

  // Fetch all recently played tracks
  const fetchAllRecentTracks = async () => {
    setLoading(true);
    let allTracks = [];
    let nextUrl = "/me/player/recently-played?limit=50";

    try {
      while (nextUrl) {
        const data = await fetchFromSpotify(nextUrl, token);
        allTracks = [...allTracks, ...data.items];
        nextUrl = data.next?.replace("https://api.spotify.com/v1", "") || null;
      }
      setRecentTracks(allTracks);
    } catch (error) {
      console.error("Error fetching recent tracks:", error);
      setRecentTracks([]);
    }
    setLoading(false);
  };

  // Fetch user's playlists
  const fetchUserPlaylists = async () => {
    try {
      const data = await fetchFromSpotify("/me/playlists", token);
      setPlaylists(data.items);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setPlaylists([]);
    }
  };

  // Add track to the selected playlist
  const addToPlaylist = async (playlistId) => {
    if (!selectedTrack) return;
    try {
      await fetchFromSpotify(`/playlists/${playlistId}/tracks`, token, "POST", {
        uris: [selectedTrack],
      });
      alert("Track added to playlist!");
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      alert("Could not add track to playlist.");
    }
    setPlaylistMenuVisible(false); // Hide menu after adding
  };

  // Play preview when hovering over a track
  const playPreview = (previewUrl) => {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    }

    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
      setPreviewAudio(audio);
    }
  };

  // Stop preview on hover out
  const stopPreview = () => {
    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold mb-6 text-center">
        Recently Played
      </h2>
      {loading ? (
        <p className="text-center text-lg">Loading recently played songs...</p>
      ) : recentTracks.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentTracks.map(({ track }, index) => (
            <li
              key={track.id + index}
              className="bg-gray-800 p-4 rounded shadow-md transform transition-transform duration-300 hover:scale-105"
              onMouseEnter={() => playPreview(track.preview_url)}
              onMouseLeave={stopPreview}
            >
              <div className="relative">
                <img
                  src={track.album.images[1]?.url}
                  alt={track.name}
                  className="w-full rounded mb-4"
                />
              </div>
              <p className="text-lg font-bold truncate">{track.name}</p>
              <p className="text-gray-400 truncate">
                Artist: {track.artists[0].name}
              </p>
              <p className="text-gray-500 truncate">
                Album: {track.album.name}
              </p>
              <button
                onClick={() => {
                  setSelectedTrack(track.uri);
                  setPlaylistMenuVisible(!playlistMenuVisible);
                }}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                Add to Playlist
              </button>
              {playlistMenuVisible && selectedTrack === track.uri && (
                <div
                  className="bg-gray-800 rounded-lg shadow-lg p-4 fixed z-50 w-64 max-h-80 overflow-y-auto"
                  style={{
                    top: `${window.scrollY + 150}px`,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <p className="text-white font-semibold text-lg mb-4">
                    Select Playlist
                  </p>
                  <ul className="space-y-2">
                    {playlists.map((playlist) => (
                      <li key={playlist.id}>
                        <button
                          onClick={() => addToPlaylist(playlist.id)}
                          className="w-full text-left text-gray-200 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg transition-colors duration-200"
                        >
                          {playlist.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-lg">No recent songs found.</p>
      )}
    </div>
  );
}
