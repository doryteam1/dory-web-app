declare const process: any;
export const environment = {
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    appId: process.env.FIREBASE_APP_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    locationId: process.env.FIREBASE_LOCATION_ID,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  },
  mapsApiKey: process.env.MAPS_API_KEY,
  production: false,
  doryApiRestBaseUrl: process.env.DORY_API_REST,
  oAuthClientId: process.env.OAUTH_CLIENT_ID,
  doryServerUrl: process.env.DORY_SERVER_URL,
  thisWebUrl: process.env.THIS_WEB_URL,
  ginelectURL: process.env.GINELECT_URL,
  limitPhotosForum: process.env.LIMIT_PHOTOS_FORUM,
  limitPhotosUserServices: process.env.LIMIT_PHOTOS_USER_SERVICES,
};
