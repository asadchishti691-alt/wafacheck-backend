# Wafacheck Backend

Stateless Express API for the Wafacheck website. **No database and no files are written** — everything lives in memory and is lost on restart.

## Run locally
```bash
npm install
cp .env.example .env     # then edit the values
npm run dev
```

## Environment variables
| Name | Required | Purpose |
|---|---|---|
| `ALLOWED_ORIGINS` | yes | Your Netlify URL(s), comma-separated, e.g. `https://your-site.netlify.app` |
| `ADMIN_USERNAME` | yes | Admin login |
| `ADMIN_PASSWORD` | yes | 12+ characters |
| `JWT_SECRET` | yes | 32+ random characters |
| `JWT_EXPIRES_IN` | no | Default `8h` |
| `NOTIFY_WEBHOOK_URL` | no | Gets `{reference, packageId, createdAt}` on each new request (no personal data) |
| `MAX_REQUESTS` / `MAX_REVIEWS` | no | Memory caps (oldest dropped first) |
| `PORT`, `NODE_ENV` | no | Set by most hosts |

The server refuses to start if a required variable is missing or too weak.

## Endpoints
**Public**
- `GET /health`
- `GET /api/packages`
- `POST /api/requests` — `{ name, whatsapp, partnerName?, packageId, details?, language?, consent: true }`
- `POST /api/reviews` — `{ name, rating (1-5), comment }` (hidden until approved)
- `GET /api/reviews` — approved reviews only

**Admin** (`Authorization: Bearer <token>`)
- `POST /api/admin/login` — `{ username, password }` → `{ token }`
- `GET /api/admin/stats`
- `GET /api/admin/requests?status=new` · `GET|PATCH|DELETE /api/admin/requests/:id` (PATCH: `status`, `adminNotes`)
- `GET /api/admin/reviews?status=pending` · `PATCH|DELETE /api/admin/reviews/:id` (PATCH: `status` = approved/rejected/pending)

Errors are JSON: `{ "error": "...", "details": [{ "field", "message" }] }`.

## Connect the Netlify site
Call the API from your page, e.g.:
```js
const API = 'https://your-backend.onrender.com';
await fetch(`${API}/api/requests`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, whatsapp, packageId: 'standard', consent: true }),
});
```
When showing admin data or reviews in HTML, insert it as text (`textContent`), not `innerHTML`.

## Important notes
- **Memory only:** free hosts sleep/restart, which erases all requests and reviews. Set `NOTIFY_WEBHOOK_URL` or check the admin panel regularly, and keep WhatsApp as the real record.
- Run a **single instance** (multiple instances would each have their own memory).
- Requests contain personal data. Serve over HTTPS only, and never log request bodies (the code doesn't).
