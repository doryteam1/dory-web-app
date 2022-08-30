export const environment = {
    firebase: {
      projectId: process.env.NG_APP_FIREBASE_PROJECT_ID,
      appId: process.env.NG_APP_FIREBASE_APP_ID,
      storageBucket: process.env.NG_APP_FIREBASE_STORAGE_BUCKET,
      locationId: process.env.NG_APP_FIREBASE_LOCATION_ID,
      apiKey: process.env.NG_APP_FIREBASE_API_KEY,
      authDomain: process.env.NG_APP_FIREBASE_AUTH_DOMAIN,
      messagingSenderId: process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
    },
    mapsApiKey:process.env.NG_APP_MAPS_API_KEY,
    production: false,
    doryApiRestBaseUrl:'https://dory-api-rest-pruebas.herokuapp.com/api',
    oAuthClientId:process.env.NG_APP_OAUTH_CLIENT_ID
  };