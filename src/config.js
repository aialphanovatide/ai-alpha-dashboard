// src/config.js
const apiUrl = process.env.REACT_APP_API_URL;
console.log('apiUrl: ', apiUrl)

const config = {
  // BASE_URL: apiUrl || 'http://localhost:9000',
  BASE_URL: apiUrl
}

export default config
