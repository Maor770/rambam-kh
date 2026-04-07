/**
 * Cloudflare Worker — GA4 Data API Proxy for Rambam Stats Dashboard
 *
 * SETUP INSTRUCTIONS:
 * ==================
 * 1. Go to https://console.cloud.google.com
 * 2. Create a new project (or use existing)
 * 3. Enable "Google Analytics Data API" (APIs & Services → Library)
 * 4. Create a Service Account (IAM & Admin → Service Accounts)
 *    - Give it a name like "rambam-stats-reader"
 *    - No extra roles needed at this step
 * 5. Create a JSON key for the service account (Keys → Add Key → JSON)
 *    - Save the downloaded JSON file
 * 6. In GA4 (analytics.google.com):
 *    - Go to Admin → Property → Property Access Management
 *    - Add the service account email (from the JSON) as a Viewer
 * 7. In Cloudflare Dashboard (dash.cloudflare.com):
 *    - Go to Workers & Pages → Create Worker
 *    - Paste this code
 *    - Go to Settings → Variables
 *    - Add these environment variables:
 *      - GA_PROPERTY_ID: Your GA4 property ID (numeric, found in Admin → Property Settings)
 *      - GA_CLIENT_EMAIL: The service account email from the JSON key
 *      - GA_PRIVATE_KEY: The private_key field from the JSON key (include the BEGIN/END lines)
 *      - ADMIN_EMAIL: Your admin email (e.g., chanoch@maor.org)
 *      - ADMIN_CODE: A secret access code you choose
 *      - ALLOWED_ORIGIN: Your site URL (e.g., https://yeshivaai.org)
 *    - Deploy the worker
 * 8. Copy the worker URL and paste it in admin/stats.html (WORKER_URL variable)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: POST /auth
      if (url.pathname === '/auth' && request.method === 'POST') {
        return handleAuth(request, env, corsHeaders);
      }

      // Route: GET /stats
      if (url.pathname === '/stats') {
        return handleStats(request, env, corsHeaders);
      }

      // Route: GET /realtime
      if (url.pathname === '/realtime') {
        return handleRealtime(request, env, corsHeaders);
      }

      return jsonResponse({ error: 'Not found' }, 404, corsHeaders);
    } catch (e) {
      return jsonResponse({ error: e.message }, 500, corsHeaders);
    }
  }
};

/* ── Auth ── */
async function handleAuth(request, env, corsHeaders) {
  const { email, code } = await request.json();

  if (email === env.ADMIN_EMAIL && code === env.ADMIN_CODE) {
    // Simple token: base64 of email + timestamp
    const token = btoa(email + ':' + Date.now());
    return jsonResponse({ token }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Invalid credentials' }, 401, corsHeaders);
}

/* ── Stats ── */
async function handleStats(request, env, corsHeaders) {
  // Verify auth
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders);
  }

  const token = authHeader.slice(7);
  try {
    const decoded = atob(token);
    if (!decoded.startsWith(env.ADMIN_EMAIL + ':')) {
      throw new Error('invalid');
    }
  } catch {
    return jsonResponse({ error: 'Invalid token' }, 401, corsHeaders);
  }

  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days') || '7');

  // Get GA4 access token
  const accessToken = await getGoogleAccessToken(env);

  // Fetch all data in parallel
  const [summary, visitorsOverTime, devices, topPages, sources, events] = await Promise.all([
    fetchSummary(env.GA_PROPERTY_ID, accessToken, days),
    fetchVisitorsOverTime(env.GA_PROPERTY_ID, accessToken, days),
    fetchDevices(env.GA_PROPERTY_ID, accessToken, days),
    fetchTopPages(env.GA_PROPERTY_ID, accessToken, days),
    fetchSources(env.GA_PROPERTY_ID, accessToken, days),
    fetchEvents(env.GA_PROPERTY_ID, accessToken, days),
  ]);

  return jsonResponse({
    summary,
    visitorsOverTime,
    devices,
    topPages,
    sources,
    events,
  }, 200, corsHeaders);
}

/* ── Realtime ── */
async function handleRealtime(request, env, corsHeaders) {
  // Verify auth
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders);
  }
  const token = authHeader.slice(7);
  try {
    const decoded = atob(token);
    if (!decoded.startsWith(env.ADMIN_EMAIL + ':')) throw new Error('invalid');
  } catch {
    return jsonResponse({ error: 'Invalid token' }, 401, corsHeaders);
  }

  const accessToken = await getGoogleAccessToken(env);

  const resp = await fetch(`${GA_API}/properties/${env.GA_PROPERTY_ID}:runRealtimeReport`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      metrics: [{ name: 'activeUsers' }],
    }),
  });
  const data = await resp.json();
  const activeUsers = parseInt(data.rows?.[0]?.metricValues?.[0]?.value || '0');

  return jsonResponse({ activeUsers }, 200, corsHeaders);
}

/* ── Google OAuth (Service Account JWT) ── */
async function getGoogleAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: env.GA_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  const signingInput = headerB64 + '.' + payloadB64;

  // Import private key
  const key = await importPrivateKey(env.GA_PRIVATE_KEY);
  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    new TextEncoder().encode(signingInput)
  );

  const jwt = signingInput + '.' + base64url(signature);

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt,
  });

  const data = await resp.json();
  return data.access_token;
}

async function importPrivateKey(pem) {
  const pemContents = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
    .trim();

  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

function base64url(input) {
  let str;
  if (typeof input === 'string') {
    str = btoa(input);
  } else {
    str = btoa(String.fromCharCode(...new Uint8Array(input)));
  }
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/* ── GA4 Data API Queries ── */
const GA_API = 'https://analyticsdata.googleapis.com/v1beta';

function dateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function getDateRange(days) {
  if (days === 0) return { startDate: 'today', endDate: 'today' };
  if (days === 1) return { startDate: 'yesterday', endDate: 'yesterday' };
  return { startDate: dateStr(days), endDate: 'today' };
}

async function gaQuery(propertyId, token, body) {
  const resp = await fetch(`${GA_API}/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return resp.json();
}

async function fetchSummary(propertyId, token, days) {
  const data = await gaQuery(propertyId, token, {
    dateRanges: [getDateRange(days)],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'userEngagementDuration' },
      { name: 'newUsers' },
    ],
  });

  const row = data.rows?.[0]?.metricValues || [];
  const users = parseInt(row[0]?.value || '0');
  const views = parseInt(row[1]?.value || '0');
  const totalDuration = parseFloat(row[2]?.value || '0');
  const newUsers = parseInt(row[3]?.value || '0');
  const returning = users > 0 ? Math.round(((users - newUsers) / users) * 100) : 0;

  return {
    users,
    pageViews: views,
    avgDuration: users > 0 ? Math.round(totalDuration / users) : 0,
    returningPercent: returning,
  };
}

async function fetchVisitorsOverTime(propertyId, token, days) {
  const data = await gaQuery(propertyId, token, {
    dateRanges: [getDateRange(days)],
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
    ],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  const labels = [];
  const users = [];
  const views = [];

  (data.rows || []).forEach(row => {
    const dateVal = row.dimensionValues[0].value; // YYYYMMDD
    const y = dateVal.slice(0, 4);
    const m = parseInt(dateVal.slice(4, 6)) - 1;
    const d = parseInt(dateVal.slice(6, 8));
    const dt = new Date(y, m, d);
    labels.push(dt.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' }));
    users.push(parseInt(row.metricValues[0].value));
    views.push(parseInt(row.metricValues[1].value));
  });

  return { labels, users, views };
}

async function fetchDevices(propertyId, token, days) {
  const data = await gaQuery(propertyId, token, {
    dateRanges: [getDateRange(days)],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'activeUsers' }],
  });

  const result = { desktop: 0, mobile: 0, tablet: 0 };
  let total = 0;

  (data.rows || []).forEach(row => {
    const cat = row.dimensionValues[0].value.toLowerCase();
    const val = parseInt(row.metricValues[0].value);
    total += val;
    if (result.hasOwnProperty(cat)) result[cat] = val;
  });

  // Convert to percentages
  if (total > 0) {
    result.desktop = Math.round((result.desktop / total) * 100);
    result.mobile = Math.round((result.mobile / total) * 100);
    result.tablet = Math.round((result.tablet / total) * 100);
  }

  return result;
}

async function fetchTopPages(propertyId, token, days) {
  const data = await gaQuery(propertyId, token, {
    dateRanges: [getDateRange(days)],
    dimensions: [{ name: 'pageTitle' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' },
      { name: 'userEngagementDuration' },
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 20,
  });

  return (data.rows || []).map(row => ({
    page: row.dimensionValues[0].value,
    views: parseInt(row.metricValues[0].value),
    users: parseInt(row.metricValues[1].value),
    avgDuration: parseInt(row.metricValues[1].value) > 0
      ? Math.round(parseFloat(row.metricValues[2].value) / parseInt(row.metricValues[1].value))
      : 0,
  }));
}

async function fetchSources(propertyId, token, days) {
  const data = await gaQuery(propertyId, token, {
    dateRanges: [getDateRange(days)],
    dimensions: [{ name: 'sessionSource' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
    ],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 10,
  });

  return (data.rows || []).map(row => ({
    source: row.dimensionValues[0].value || '(direct)',
    users: parseInt(row.metricValues[0].value),
    views: parseInt(row.metricValues[1].value),
  }));
}

async function fetchEvents(propertyId, token, days) {
  const customEvents = ['share_click', 'halacha_view', 'daf_view', 'tanya_view', 'bookmark_add', 'feedback_submit'];

  const data = await gaQuery(propertyId, token, {
    dateRanges: [getDateRange(days)],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        inListFilter: { values: customEvents },
      },
    },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
  });

  const typeMap = {
    share_click: 'share',
    halacha_view: 'view',
    daf_view: 'view',
    tanya_view: 'view',
    bookmark_add: 'bookmark',
    feedback_submit: 'view',
  };

  return (data.rows || []).map(row => ({
    name: row.dimensionValues[0].value,
    type: typeMap[row.dimensionValues[0].value] || 'view',
    count: parseInt(row.metricValues[0].value),
  }));
}

/* ── Helpers ── */
function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
