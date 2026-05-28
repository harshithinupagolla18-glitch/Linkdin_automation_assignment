# LinkedIn API Server

This folder contains a small Express server that handles LinkedIn OAuth and calls LinkedIn APIs from the server side (so secrets/tokens are not exposed to the browser).

## Setup

1. Create an env file:

   - Copy `server/.env.example` to `server/.env`
   - Fill in `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`

2. Install dependencies:

   ```bash
   npm --prefix server install
   ```

3. Run:

   ```bash
   npm --prefix server start
   ```

Then start the React app from the parent folder (`npm start`) and click **Connect LinkedIn** on the Dashboard.

## Endpoints

- `GET /auth/linkedin` start OAuth
- `GET /auth/linkedin/callback` OAuth redirect
- `GET /api/status` session auth status
- `GET /api/profile` LinkedIn profile via `https://api.linkedin.com/v2/userinfo`
- `GET /api/posts` placeholder (requires additional app permissions)

