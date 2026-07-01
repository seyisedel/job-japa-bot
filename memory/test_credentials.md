# JobJapa Admin — Test Credentials

## How to create an admin login (one-time)

The dashboard now uses **Supabase Auth (email/password)** with a client-side whitelist.

### 1. Set the email whitelist
`/app/frontend/.env`:
```
REACT_APP_ADMIN_EMAILS=admin@jobjapa.com,ops@jobjapa.com
```
Comma-separated. Only these emails may sign in. Restart the frontend after changes:
```
sudo supervisorctl restart frontend
```

### 2. Create the admin user in Supabase
1. Open your Supabase project → **Authentication → Users**
2. Click **Add user → Create new user**
3. Enter one of the whitelisted emails (e.g. `admin@jobjapa.com`) and a strong password
4. Check **Auto Confirm User** (so the account is immediately usable, no email verification round-trip needed)
5. Click **Create user**

### 3. Sign in
Go to the dashboard URL and sign in with that email/password.

## Currently configured
- `REACT_APP_ADMIN_EMAILS=admin@jobjapa.com`
- **No admin user exists in Supabase yet** — you need to create one via the steps above before you can log in.

## Session policy (enforced client-side)
- **Inactivity timeout:** 15 minutes (mouse/keyboard/scroll/touch resets it)
- **Absolute lifetime:** 8 hours from sign-in, regardless of activity

## Recommended Supabase dashboard settings (defense in depth)
- Authentication → Providers → Email: **enabled**
- Authentication → General configuration → **Allow new users to sign up: OFF** (admins are provisioned manually)
- Confirm email: OFF (or ON if you require verified admins — then check "Auto Confirm" when creating each user)
- Sessions → Time-box user sessions: **8 hours** (Pro plan and above; free plan can rely purely on the client timer)
- Sessions → Inactivity timeout: **15 minutes** (Pro plan and above)
