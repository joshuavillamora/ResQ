# ResQ Mobile

ResQ Mobile is the citizen-facing app for reporting emergencies, checking nearby incidents, viewing hotlines, and updating submitted reports.

## Mobile setup

1. Open this folder:

```bash
cd frontend/mobile
```

2. Install packages:

```bash
npm install
```

3. Configure the mobile app runtime values in `app.json`:

```json
"extra": {
  "resqApiBaseUrl": "http://127.0.0.1:8000",
  "resqSmsEnabled": true,
  "resqSmsFallbackNumber": "+639000000000"
}
```

4. Start Expo:

```bash
npx expo start
```

## Mobile notes

- Mobile screens are connected to the backend for report creation, report updates, report history, map feed, hotlines, and profile login/register.
- Set `expo.extra.resqApiBaseUrl` to a backend URL reachable by your phone or emulator.
- For Android SMS fallback testing, set `expo.extra.resqSmsEnabled` and `expo.extra.resqSmsFallbackNumber`.
- Silent SMS fallback requires an Android development build or APK. Expo Go does not include the native SMS module.

## Report submission flow

On Android, the app follows this order:

1. Capture the current location.
2. Try sending the report to the backend (`POST /report`).
3. If the backend is unavailable, send the fallback SMS payload from the app.

Example SMS payload:

```text
FLOOD|user_12|10.721200|122.562100|Barangay San Jose|report_abcd1234
```

## Environment tips

- Android emulator to local backend: use `http://10.0.2.2:8000`.
- Physical device to local backend: use your machine's LAN IP (for example `http://192.168.1.20:8000`).
- If backend auth and report calls fail, confirm both backend server status and `resqApiBaseUrl` first.

