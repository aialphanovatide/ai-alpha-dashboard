// src/config.js
const BASE_URL_API = process.env.REACT_APP_API_URL;
const NOVATIDE_URL_API = process.env.REACT_APP_NOVATIDE_URL_API;
const BOTS_V2 = process.env.REACT_APP_V2_API;
const AWS_REGION = process.env.REACT_APP_AWS_REGION
const AWS_ICONS = process.env.REACT_APP_AWS_ICONS_BUCKET
const X_API_KEY = process.env.REACT_APP_X_API_KEY

//config server
const config = {
   BASE_URL:  BASE_URL_API,
   NOVATIDE_URL: NOVATIDE_URL_API,
   BOTS_V2_API: BOTS_V2,
   AWS_REGION: AWS_REGION,
   S3_BUCKET: AWS_ICONS,
   X_API_KEY: X_API_KEY,
}
export default config