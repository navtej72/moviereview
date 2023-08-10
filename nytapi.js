// nytApi.js
const axios = require('axios');

const NY_TIMES_API_KEY = "I1ARBI8u8d49Y0jYuNY30PWKmHYXVV1o"; // Replace with your actual New York Times API key
const NY_TIMES_API_URL = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";

const getMovieReviews = (query) => {
  return axios.get(NY_TIMES_API_URL, {
    params: {
      query: query,
      "api-key": NY_TIMES_API_KEY,
      "byline": ""
    }
  });
};

const getLatestMovieReviews = (startDate) => {
  return axios.get(NY_TIMES_API_URL, {
    params: {
      "api-key": NY_TIMES_API_KEY,
      "byline": "",
      "publication_date.gt": startDate, // Fetch reviews published after the startDate
    },
  });
};

// nytApi.js
// ... (existing code)
module.exports = {
  getMovieReviews,
  getLatestMovieReviews,
};
