// src/config.js
const apiUrl = process.env.REACT_APP_API_URL;

const config = {
  BASE_URL: apiUrl || 'http://localhost:9000',
}

export default config
