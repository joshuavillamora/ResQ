# ResQ Mobile

## Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Use an Android development build or APK for the offline SMS fallback.
   Expo Go does not include the native SMS module.

3. Start the app:

   ```bash
   npx expo start
   ```

## Offline SMS fallback

The app now uses this report flow on Android:

1. Capture the user's current location on app open.
2. Try `POST /report` first.
3. If the backend is unreachable, send a silent SMS fallback from the app itself.

Configure these values in [`app.json`](/C:/Users/TUF/ResQ/frontend/mobile/app.json):

- `expo.extra.resqApiBaseUrl`
- `expo.extra.resqSmsEnabled`
- `expo.extra.resqSmsFallbackNumber`

The SMS payload format is:

```text
FLOOD|user_12|10.721200|122.562100|Barangay San Jose|report_abcd1234
```

