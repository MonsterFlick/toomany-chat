# TooMany Chat — Setup Guide (0 → 100)

Your app URL: **https://toomany-chat-tp2l.vercel.app**

> **No OAuth or Business Verification needed!**
> This app uses a manually generated access token — takes ~5 minutes to set up.

---

## PHASE 1 — Meta Developer App

### Step 1: Create a Meta Developer Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click **"Get Started"** → log in with Facebook → accept terms

### Step 2: Create a New App
1. Click **"My Apps" → "Create App"**
2. **Use case** → **"Other"**
3. **App type** → **"Business"**
4. Fill in:
   - **App name**: `toomany-chat`
   - **Contact email**: your email
5. Click **"Create App"**

> ✅ Note your **App ID** and **App Secret** from App Settings → Basic

---

## PHASE 2 — App Basic Settings

Go to **App Settings → Basic** and fill in:

| Field | Value |
|---|---|
| **App Domains** | `toomany-chat-tp2l.vercel.app` |
| **Privacy Policy URL** | `https://toomany-chat-tp2l.vercel.app/privacy` |
| **Terms of Service URL** | `https://toomany-chat-tp2l.vercel.app/privacy` |
| **User Data Deletion URL** | `https://toomany-chat-tp2l.vercel.app/data-deletion` |
| **Category** | `Business and Pages` |
| **Website → Site URL** (scroll to bottom) | `https://toomany-chat-tp2l.vercel.app` |

Click **"Save Changes"**

---

## PHASE 3 — Add Instagram Product

1. Left sidebar → **"Add Product"**
2. Find **"Instagram Graph API"** → Click **Set Up**
3. That's it — no Facebook Login needed!

---

## PHASE 4 — Connect Your Instagram Account

> Your Instagram must be a **Business or Creator account**

### Step 3: Link Instagram to a Facebook Page
1. Go to [facebook.com](https://facebook.com) → your **Facebook Page**
2. Page Settings → **"Linked Accounts"** → Connect Instagram
3. Log in to your Instagram account and confirm

---

## PHASE 5 — Generate Access Token ⭐ (Most Important Step)

### Step 4: Use Graph API Explorer
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Top right dropdown → select your app **"toomany-chat"**
3. Click **"Generate Access Token"**
4. Check these permissions:
   - `instagram_basic`
   - `instagram_manage_comments`
   - `instagram_manage_insights`
   - `instagram_manage_messages`
   - `pages_show_list`
5. Click **Generate** → login with Facebook → authorize
6. Copy the token shown

### Step 5: Exchange for Long-Lived Token (60 days)
In the same Graph API Explorer, run this query:
```
GET /oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_TOKEN
```
Or just use the token directly — it'll work for testing (short-lived = 1 hour, long-lived = 60 days).

---

## PHASE 6 — Configure Webhooks

### Step 6: Set Up Webhook for Comments
1. Left sidebar → **"Webhooks"**
2. Click **"Add Callback URL"**

| Field | Value |
|---|---|
| **Callback URL** | `https://toomany-chat-tp2l.vercel.app/api/webhook` |
| **Verify Token** | `my_secret_verify_token` |

3. Click **"Verify and Save"** → should show ✅ Verified
4. Then subscribe to the **`comments`** field under Instagram

---

## PHASE 7 — Vercel Environment Variables

Go to [vercel.com](https://vercel.com) → your project → **Settings → Environment Variables**

| Variable | Value |
|---|---|
| `INSTAGRAM_APP_ID` | Your App ID (e.g. `2140620066757781`) |
| `INSTAGRAM_APP_SECRET` | Your App Secret from Meta |
| `NEXT_PUBLIC_BASE_URL` | `https://toomany-chat-tp2l.vercel.app` |
| `WEBHOOK_VERIFY_TOKEN` | `my_secret_verify_token` |
| `DEFAULT_REWARD_URL` | `https://omthakur.in` |

> ⚠️ After saving env vars → **Redeploy** (Deployments tab → ⋮ → Redeploy)

---

## PHASE 8 — Go Live

1. In Meta App, toggle from **"Development"** to **"Live"** at the top
2. All the Basic Settings from Phase 2 must be filled in for this to work

---

## PHASE 9 — Connect on the App ⭐

1. Visit **https://toomany-chat-tp2l.vercel.app**
2. Click **"Connect Instagram"**
3. Paste your **access token** from Phase 5
4. Click **"Connect"** → you'll be redirected to the Dashboard ✅

---

## Quick Checklist

```
[ ] Meta Developer account created
[ ] App created (type: Business, use case: Other)
[ ] App Domains set: toomany-chat-tp2l.vercel.app
[ ] Privacy Policy URL set
[ ] Data Deletion URL set
[ ] Category set + Site URL set
[ ] Instagram Graph API product added
[ ] Instagram Business account linked to Facebook Page
[ ] Access token generated from Graph API Explorer
[ ] Webhook verified: .../api/webhook (verify token: my_secret_verify_token)
[ ] Webhook subscribed to: comments field
[ ] All 5 Vercel env vars set correctly + redeployed
[ ] App switched to Live mode on Meta
[ ] Token pasted into the app and connected
[ ] Dashboard shows real account data
[ ] Automation rule created and tested
```

---

## Troubleshooting

| Error | Fix |
|---|---|
| `Can't load URL` | Add `toomany-chat-tp2l.vercel.app` to App Domains in Basic Settings |
| `No Instagram account found` | Make sure Instagram is linked to a Facebook Page |
| Webhook not verifying | Verify token on Vercel must equal `my_secret_verify_token` |
| Token expired | Get a new long-lived token from Graph API Explorer (valid 60 days) |
| DMs not sending | Need `instagram_manage_messages` permission on the token |
