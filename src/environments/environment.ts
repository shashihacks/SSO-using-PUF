// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  apiUrl: 'http://localhost:3000',

  firebaseConfig: {
    apiKey: "AIzaSyAzS8MmxAoTIZkh5hDj5kaEyIURWNpO3_w",
    authDomain: "pufs-f13d7.firebaseapp.com",
    projectId: "pufs-f13d7",
    storageBucket: "pufs-f13d7.appspot.com",
    messagingSenderId: "1067723588014",
    appId: "1:1067723588014:web:6c5d531b3baa2fd4f7083f"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
