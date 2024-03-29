const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.FIREBASE_PROJECT_ID": JSON.stringify(
        process.env.FIREBASE_PROJECT_ID
      ),
      "process.env.FIREBASE_APP_ID": JSON.stringify(
        process.env.FIREBASE_APP_ID
      ),
      "process.env.FIREBASE_STORAGE_BUCKET": JSON.stringify(
        process.env.FIREBASE_STORAGE_BUCKET
      ),
      "process.env.FIREBASE_LOCATION_ID": JSON.stringify(
        process.env.FIREBASE_LOCATION_ID
      ),
      "process.env.FIREBASE_API_KEY": JSON.stringify(
        process.env.FIREBASE_API_KEY
      ),
      "process.env.FIREBASE_AUTH_DOMAIN": JSON.stringify(
        process.env.FIREBASE_AUTH_DOMAIN
      ),
      "process.env.FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(
        process.env.FIREBASE_MESSAGING_SENDER_ID
      ),
      "process.env.MAPS_API_KEY": JSON.stringify(process.env.MAPS_API_KEY),
      "process.env.DORY_API_REST": JSON.stringify(process.env.DORY_API_REST),
      "process.env.OAUTH_CLIENT_ID": JSON.stringify(
        process.env.OAUTH_CLIENT_ID
      ),
      "process.env.DORY_SERVER_URL": JSON.stringify(
        process.env.DORY_SERVER_URL
      ),
      "process.env.THIS_WEB_URL": JSON.stringify(process.env.THIS_WEB_URL),
      "process.env.GINELECT_URL": JSON.stringify(process.env.GINELECT_URL),
      "process.env.LIMIT_PHOTOS_FORUM": JSON.stringify(
        process.env.LIMIT_PHOTOS_FORUM
      ),
      "process.env.LIMIT_PHOTOS_USER_SERVICES": JSON.stringify(
        process.env.LIMIT_PHOTOS_USER_SERVICES
      ),
    }),
    new Dotenv(),
  ],
};
