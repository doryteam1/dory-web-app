const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "process.env.FIREBASE_PROJECT_ID": JSON.stringify(process.env.FIREBASE_PROJECT_ID),
            "process.env.FIREBASE_APP_ID": process.env.FIREBASE_APP_ID,
            "process.env.FIREBASE_STORAGE_BUCKET": process.env.FIREBASE_STORAGE_BUCKET,
            "process.env.FIREBASE_LOCATION_ID": process.env.FIREBASE_LOCATION_ID,
            "process.env.FIREBASE_API_KEY": process.env.FIREBASE_API_KEY,
            "process.env.FIREBASE_AUTH_DOMAIN": process.env.FIREBASE_AUTH_DOMAIN,
            "process.env.FIREBASE_MESSAGING_SENDER_ID": process.env.FIREBASE_MESSAGING_SENDER_ID,
            "process.env.MAPS_API_KEY": process.env.MAPS_API_KEY,
            "process.env.DORY_API_REST": JSON.stringify(process.env.DORY_API_REST),
            "process.env.OAUTH_CLIENT_ID": process.env.OAUTH_CLIENT_ID,
            "VERSION": JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN)
        })
    ]
}