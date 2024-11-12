// netlify/functions/callback.js

exports.handler = async (event, context) => {
    const { code } = event.queryStringParameters;
  
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Authorization code is missing" }),
      };
    }
  
    // Lógica para intercambiar el 'code' por el 'access_token'
    // (similar a lo que ya habías hecho en la función de Spotify Auth)
  
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
    const REDIRECT_URI = "https://spontaneous-kangaroo-b81304.netlify.app/callback";
  
    const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: data.error }),
        };
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
  