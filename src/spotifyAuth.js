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

export const getAuthUrl = () => {
  return (
    "https://accounts.spotify.com/authorize?" +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` + // Cambiado de 'token' a 'code'
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(SCOPES.join(" "))}`
  );
};

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

// Esta función puede manejar el intercambio del código por el token de acceso.
export const getAccessTokenFromCode = async (code) => {
  try {
    const response = await fetch(`/.netlify/functions/spotifyAuth?code=${code}`);
    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("spotifyAccessToken", data.access_token);
    }

    return data;
  } catch (error) {
    console.error("Error getting access token", error);
  }
};
