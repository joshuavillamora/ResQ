# ResQ

ResQ is a disaster reporting platform that allows citizens to quickly report emergencies using a simple icon-based interface.

## Backend setup

1. Create and activate a Python virtual environment.
2. Install the backend packages:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and update the Neon database connection.
4. Run the backend from the project root:

```bash
.\backend\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

## Backend notes

- The backend is inside the `backend/` folder only.
- The app supports guest reports, logged-in reports, SMS intake, hotlines, and responder status updates.
- Public registration is for civilians by default.
- If you want to create responder or station admin accounts using `/register`, send an `X-Setup-Key` header that matches `STAFF_SETUP_KEY`.
  Fast way to generate them in PowerShell:
  python -c "import secrets; print(secrets.token_hex(32))"
- This version uses SQLAlchemy `create_all`, so it works best on a fresh Neon schema or database.

## Frontend integration notes

- Web admin currently uses mock data for the hackathon demo and can be deployed independently on Vercel.
- Mobile civilian screens now use the backend for report creation, report update, report history, hotlines, map feed, and profile login/register.
- Set `frontend/mobile/app.json` `expo.extra.resqApiBaseUrl` to the backend URL your phone or emulator can reach.
- Set `frontend/mobile/app.json` `expo.extra.resqSmsEnabled` and `expo.extra.resqSmsFallbackNumber` before testing Android SMS fallback builds.
- The mobile responder or dispatch app is not part of this version of the project.

## Hackathon deployment

### Backend on Render

1. Push this repo to GitHub.
2. In Render, create a Blueprint or Web Service from the repo.
3. Use the included [`render.yaml`](/C:/Users/TUF/ResQ/render.yaml) or these equivalent settings:

```bash
Build Command: pip install -r requirements.txt
Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

4. Set these Render environment variables:

```bash
DATABASE_URL=your_neon_database_url
SECRET_KEY=your_secret_key
TOKEN_HOURS=24
STAFF_SETUP_KEY=your_staff_setup_key
```

### Web on Vercel

1. Import `frontend/web` into Vercel as a Next.js project.
2. Set the project root to `frontend/web` if Vercel asks for it.
3. Deploy with default Next.js settings.

The admin site currently uses mock data, so it does not need the backend to be live for the hackathon website demo.

### Mobile APK

Before building the Android APK or development build, update [`frontend/mobile/app.json`](/C:/Users/TUF/ResQ/frontend/mobile/app.json):

```json
"extra": {
  "resqApiBaseUrl": "https://your-render-service.onrender.com",
  "resqSmsEnabled": true,
  "resqSmsFallbackNumber": "+639000000000"
}
```

Use an Android dev build or APK for the silent SMS fallback. Expo Go does not include the native SMS module.

Suggested hackathon split:

- Vercel website: mock-backed admin demo
- Render backend: live mobile reporting and SMS parser demo
- Neon database: live backend storage
- Android APK: mobile demo app

Important: with this setup, the admin website is not live-synced to the backend data. Present it as the admin interface demo, while the mobile app + Render backend show the live reporting flow.
