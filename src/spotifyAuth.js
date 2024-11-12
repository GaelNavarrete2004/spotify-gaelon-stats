// spotifyAuth.js

const CLIENT_ID = "79f742e2bb194cc2b9756caebc221c22";
const REDIRECT_URI = "https://spontaneous-kangaroo-b81304.netlify.app/callback";
const SCOPES = [
  "user-read-private",
  "user-read-recently-played",
  "user-read-email",
  "user-top-read",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-read",
  "user-library-modify",
];

/**
 * Generates the Spotify authentication URL for the Implicit Grant flow.
 * Redirects the user to Spotify's authorization page.
 */
export const getAuthUrl = () => {
  return (
    "https://accounts.spotify.com/authorize?" +
    `client_id=${CLIENT_ID}&` +
    `response_type=token&` + // Use 'token' to get access token directly
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(SCOPES.join(" "))}`
  );
};

/**
 * Fetches data from the Spotify API using the access token stored in localStorage.
 * @param {string} endpoint - The endpoint to fetch from (e.g., "/me").
 * @returns {Promise<Object>} The response data from Spotify API.
 */
export const fetchFromSpotify = async (endpoint) => {
  const token = localStorage.getItem("spotifyAccessToken");

  if (!token) {
    throw new Error("Access token is missing");
  }

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data from Spotify");
  }

  return response.json();
};
