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
uvicorn backend.main:app --reload
```

## Backend notes

- The backend is inside the `backend/` folder only.
- The app supports guest reports, logged-in reports, SMS intake, hotlines, and responder status updates.
- Public registration is for civilians by default.
- If you want to create responder or station admin accounts using `/register`, send an `X-Setup-Key` header that matches `STAFF_SETUP_KEY`.
- This version uses SQLAlchemy `create_all`, so it works best on a fresh Neon schema or database.
