const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const getAccessToken = async (req, res) => {
  try {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.APP_SECRET;
    const tokenEndpoint = "https://api.sandbox.paypal.com/v1/oauth2/token"; // For sandbox environment

    const credentials = `${clientId}:${clientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString("base64");

    const requestBody = "grant_type=client_credentials";

    const config = {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await axios.post(tokenEndpoint, requestBody, config);

    const accessToken = response.data.access_token;
    res.json({ accessToken });
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    res.status(500).json({ error: "Error fetching access token" });
  }
};

module.exports = {
  getAccessToken,
};
