const axios = require("axios");
require("dotenv").config();

const publicApiUrl = process.env.PUBLIC_API_URL; // Set this in your .env file

async function getPublicProfile(apiKey) {
  try {
    const response = await axios.post(
      `${publicApiUrl}/api/public/profile`,
      {},
      {
        headers: { "x-api-key": apiKey },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching public profile:", error);
    throw error;
  }
}

async function getPublicCandidates(apiKey) {
  try {
    const response = await axios.get(`${publicApiUrl}/api/public/candidate`, {
      headers: { "x-api-key": apiKey },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching public candidates:", error);
    throw error;
  }
}

module.exports = {
  getPublicProfile,
  getPublicCandidates,
};
