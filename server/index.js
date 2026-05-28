import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import session from 'express-session';

const PORT = Number(process.env.PORT || 5000);
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || '';
const LINKEDIN_REDIRECT_URI =
  process.env.LINKEDIN_REDIRECT_URI || `http://localhost:${PORT}/auth/linkedin/callback`;

const APIFY_TOKEN = process.env.APIFY_TOKEN || '';
const APIFY_ACTOR_ID = process.env.APIFY_ACTOR_ID || '';

function requireEnv(name, value) {
  if (!value) {
    const err = new Error(
      `Missing ${name}. Create server/.env with ${name}=... (see server/.env.example).`
    );
    err.statusCode = 500;
    throw err;
  }
}

async function exchangeCodeForToken(code) {
  requireEnv('LINKEDIN_CLIENT_ID', LINKEDIN_CLIENT_ID);
  requireEnv('LINKEDIN_CLIENT_SECRET', LINKEDIN_CLIENT_SECRET);
  requireEnv('LINKEDIN_REDIRECT_URI', LINKEDIN_REDIRECT_URI);

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    client_id: LINKEDIN_CLIENT_ID,
    client_secret: LINKEDIN_CLIENT_SECRET,
  });

  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`LinkedIn token exchange failed (${res.status}). ${text}`);
    err.statusCode = 502;
    throw err;
  }

  return await res.json();
}

function normalizeLinkedInUrl(url) {
  const u = String(url || '').trim();
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return `https://${u}`;
}

async function apifyRunSync(input) {
  requireEnv('APIFY_TOKEN', APIFY_TOKEN);
  requireEnv('APIFY_ACTOR_ID', APIFY_ACTOR_ID);

  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(
    APIFY_ACTOR_ID
  )}/run-sync-get-dataset-items?token=${encodeURIComponent(APIFY_TOKEN)}&clean=true`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Apify run failed (${res.status}). ${text}`);
    err.statusCode = 502;
    throw err;
  }

  return await res.json();
}

async function linkedinGet(accessToken, url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`LinkedIn API failed (${res.status}). ${text}`);
    err.statusCode = 502;
    throw err;
  }

  return await res.json();
}

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: APP_BASE_URL,
    credentials: true,
  })
);
app.use(
  session({
    name: 'las.sid',
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/auth/linkedin', (req, res) => {
  requireEnv('LINKEDIN_CLIENT_ID', LINKEDIN_CLIENT_ID);
  requireEnv('LINKEDIN_REDIRECT_URI', LINKEDIN_REDIRECT_URI);

  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;

  // NOTE: LinkedIn scopes depend on your app approval. Start with OpenID Connect basics.
  const scope = encodeURIComponent(
    (process.env.LINKEDIN_SCOPES || 'openid profile email').trim()
  );

  const authorizeUrl =
    'https://www.linkedin.com/oauth/v2/authorization' +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(LINKEDIN_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}` +
    `&state=${encodeURIComponent(state)}` +
    `&scope=${scope}`;

  res.redirect(authorizeUrl);
});

app.get('/auth/linkedin/callback', async (req, res, next) => {
  try {
    const { code, state, error, error_description } = req.query;

    if (error) {
      return res.redirect(
        `${APP_BASE_URL}/?auth=error&reason=${encodeURIComponent(
          `${error}: ${error_description || ''}`.trim()
        )}`
      );
    }

    if (!code || typeof code !== 'string') {
      const err = new Error('Missing code');
      err.statusCode = 400;
      throw err;
    }

    if (!state || typeof state !== 'string' || state !== req.session.oauthState) {
      const err = new Error('Invalid OAuth state');
      err.statusCode = 400;
      throw err;
    }

    const token = await exchangeCodeForToken(code);
    req.session.linkedinAccessToken = token.access_token;
    req.session.linkedinExpiresAt = Date.now() + (token.expires_in || 0) * 1000;

    res.redirect(`${APP_BASE_URL}/?auth=ok`);
  } catch (e) {
    next(e);
  }
});

app.post('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('las.sid');
    res.json({ ok: true });
  });
});

app.get('/api/status', (req, res) => {
  const authed = Boolean(req.session.linkedinAccessToken);
  res.json({
    authed,
    expiresAt: req.session.linkedinExpiresAt || null,
  });
});

app.get('/api/profile', async (req, res, next) => {
  try {
    const token = req.session.linkedinAccessToken;
    if (!token) return res.status(401).json({ error: 'not_authenticated' });

    // OIDC userinfo works with "openid profile email" scopes.
    const profile = await linkedinGet(token, 'https://api.linkedin.com/v2/userinfo');
    res.json(profile);
  } catch (e) {
    next(e);
  }
});

// Third-party fetch (example: Apify actor that scrapes public LinkedIn profile pages).
// You must supply APIFY_TOKEN + APIFY_ACTOR_ID in server/.env.
app.get('/api/thirdparty/profile', async (req, res, next) => {
  try {
    const url = normalizeLinkedInUrl(req.query.url);
    if (!url) return res.status(400).json({ error: 'missing_url' });

    // Input shape depends on the actor you choose. Many LinkedIn profile actors accept either:
    // - { profileUrls: ["https://www.linkedin.com/in/..."] }
    // - or { urls: [...] }
    // We send both to be tolerant.
    const items = await apifyRunSync({ profileUrls: [url], urls: [url] });
    const first = Array.isArray(items) ? items[0] : null;
    if (!first) return res.json({ item: null });

    res.json({ item: first });
  } catch (e) {
    next(e);
  }
});

app.get('/api/thirdparty/posts', async (req, res, next) => {
  try {
    const url = normalizeLinkedInUrl(req.query.url);
    if (!url) return res.status(400).json({ error: 'missing_url' });

    const items = await apifyRunSync({ profileUrls: [url], urls: [url] });
    const first = Array.isArray(items) ? items[0] : null;
    const posts =
      first?.posts ||
      first?.recentPosts ||
      first?.activity ||
      first?.updates ||
      [];
    res.json({ items: Array.isArray(posts) ? posts : [], item: first || null });
  } catch (e) {
    next(e);
  }
});

// LinkedIn does not provide general "feed posts" APIs unless your app has specific permissions.
// This endpoint is a placeholder you can extend once you have the approved scopes/endpoints.
app.get('/api/posts', async (req, res) => {
  const token = req.session.linkedinAccessToken;
  if (!token) return res.status(401).json({ error: 'not_authenticated' });
  res.json({ items: [], note: 'Configure approved LinkedIn endpoints/scopes to fetch posts.' });
});

app.use((err, _req, res, _next) => {
  const status = Number(err?.statusCode || 500);
  res.status(status).json({
    error: 'server_error',
    message: err?.message || 'Unknown error',
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`LinkedIn API server listening on http://localhost:${PORT}`);
});

