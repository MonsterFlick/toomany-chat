# TooMany Chat — Complete Setup Guide (0 → 100)

Your app URL: **https://toomany-chat-tp2l.vercel.app**

---

## PHASE 1 — Meta Developer App Setup

### Step 1: Create a Meta Developer Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click **"Get Started"** and log in with your Facebook account
3. Accept the developer terms

### Step 2: Create a New App
1. Click **"My Apps" → "Create App"**
2. **Use case** → Select **"Other"**
3. **App type** → Select **"Business"**
4. Fill in:
   - **App name**: `toomany-chat`
   - **Contact email**: your email
5. Click **"Create App"**

> ✅ Copy your **App ID** and **App Secret** from App Settings → Basic

---

## PHASE 2 — App Settings (Basic)

Go to **App Settings → Basic** and fill in all fields:

| Field | Value |
|---|---|
| **App Domains** | `toomany-chat-tp2l.vercel.app` |
| **Privacy Policy URL** | `https://toomany-chat-tp2l.vercel.app/privacy` |
| **Terms of Service URL** | `https://toomany-chat-tp2l.vercel.app/privacy` |
| **User Data Deletion URL** | `https://toomany-chat-tp2l.vercel.app/data-deletion` |
| **Category** | `Business and Pages` |
| **Site URL** (scroll to bottom, Website section) | `https://toomany-chat-tp2l.vercel.app` |

Click **"Save Changes"**

---

## PHASE 3 — Add Products

### Step 3: Add Facebook Login
1. Left sidebar → **"Add Product"**
2. Find **"Facebook Login for Business"** → Click **Set Up**
3. Choose **"Web"**
4. Go to **Facebook Login → Settings**
5. Under **Valid OAuth Redirect URIs**, add:
   ```
   https://toomany-chat-tp2l.vercel.app/api/auth/callback
   ```
6. Click **"Save Changes"**

### Step 4: Add Instagram Graph API
1. Left sidebar → **"Add Product"**
2. Find **"Instagram Graph API"** → Click **Set Up**
3. Go to **Instagram Graph API → Settings**
4. Connect your Instagram Business/Creator account

### Step 5: Add Instagram Messaging
1. Left sidebar → **"Add Product"**
2. Find **"Messenger"** → Click **Set Up**
3. This enables DM sending via the Instagram Messaging API

---

## PHASE 4 — Connect Instagram Account

### Step 6: Link Instagram to a Facebook Page
> Your Instagram must be a **Business or Creator account**

1. Go to [facebook.com](https://facebook.com) → your **Facebook Page**
2. Page Settings → **"Linked Accounts"** → Connect Instagram
3. Log in to your Instagram account

### Step 7: Generate Access Token
1. In Meta App → **Instagram Graph API → Generate Access Tokens**
2. Select your Facebook Page (linked to your Instagram)
3. Grant all requested permissions
4. Copy the generated token

---

## PHASE 5 — Configure Webhooks

### Step 8: Set Up Webhook
1. Left sidebar → **"Webhooks"** (or find it under Instagram API)
2. Click **"Add Callback URL"**

| Field | Value |
|---|---|
| **Callback URL** | `https://toomany-chat-tp2l.vercel.app/api/webhook` |
| **Verify Token** | `my_secret_verify_token` |

3. Click **"Verify and Save"** — should say ✅ Verified
4. Subscribe to the **`comments`** field

---

## PHASE 6 — Vercel Environment Variables

### Step 9: Set All Env Vars on Vercel
Go to [vercel.com](https://vercel.com) → your project → **Settings → Environment Variables**

| Variable | Value |
|---|---|
| `INSTAGRAM_APP_ID` | Your App ID from Meta (e.g. `2140620066757781`) |
| `INSTAGRAM_APP_SECRET` | Your App Secret from Meta |
| `NEXT_PUBLIC_BASE_URL` | `https://toomany-chat-tp2l.vercel.app` |
| `WEBHOOK_VERIFY_TOKEN` | `my_secret_verify_token` |
| `DEFAULT_REWARD_URL` | `https://omthakur.in` |

> ⚠️ After adding/changing env vars, you **must redeploy**:
> Deployments tab → click **⋮** on latest → **Redeploy**

---

## PHASE 7 — Go Live

### Step 10: Switch App to Live Mode
1. In Meta App Dashboard, find the toggle at the top: **"Development ↔ Live"**
2. Before going Live, Meta requires:
   - ✅ Privacy Policy URL (set in Phase 2)
   - ✅ Data Deletion URL (set in Phase 2)
   - ✅ App Domains (set in Phase 2)
   - ✅ Category selected (set in Phase 2)
3. Toggle to **"Live"**

---

## PHASE 8 — App Review (for Public Use)

> If you only use the app with your **own** Instagram account (the one used to create the Meta app), you can skip App Review.
> For other users to connect, you need to submit for review.

### Step 11: Request Advanced Permissions
1. Left sidebar → **"App Review → Permissions and Features"**
2. Request these permissions:
   - `instagram_basic`
   - `instagram_manage_comments`
   - `instagram_manage_insights`
   - `instagram_manage_messages`
   - `pages_show_list`
3. For each, click **"Request Advanced Access"** and submit use case description

---

## PHASE 9 — Test the Full Flow

### Step 12: Connect Instagram on Your App
1. Visit **https://toomany-chat-tp2l.vercel.app**
2. Click **"Connect Instagram"**
3. Log in with Facebook → authorize the app
4. You should be redirected to the **Dashboard** ✅

### Step 13: Test Automation
1. Go to **Automation** page
2. Make sure a rule is active (e.g. keyword: `FREE`)
3. Comment `FREE` on one of your reels from a different account
4. Within 30 seconds, a DM should be sent automatically

---

## Quick Reference Checklist

```
[ ] Meta Developer account created
[ ] App created (type: Business, use case: Other)
[ ] App domains set: toomany-chat-tp2l.vercel.app
[ ] Privacy Policy URL set
[ ] Data Deletion URL set
[ ] Category set
[ ] Site URL set
[ ] Facebook Login product added
[ ] OAuth redirect URI added: .../api/auth/callback
[ ] Instagram Graph API product added
[ ] Messenger product added
[ ] Instagram Business account linked to Facebook Page
[ ] Webhook URL verified: .../api/webhook
[ ] Webhook subscribed to: comments
[ ] All 5 Vercel env vars set correctly
[ ] App redeployed on Vercel after env vars
[ ] App switched to Live mode
[ ] Successfully connected Instagram on the app
[ ] Automation rule created and tested
```

---

## Troubleshooting

| Error | Fix |
|---|---|
| `Can't load URL` | Add `toomany-chat-tp2l.vercel.app` to **App Domains** in Basic Settings |
| `Invalid app ID` | Make sure `INSTAGRAM_APP_ID` on Vercel matches Meta dashboard |
| `auth_error` | Check App Secret matches between Vercel env and Meta dashboard |
| `no_ig_account` | Instagram account must be Business/Creator and linked to a Facebook Page |
| Webhook not verifying | Make sure `WEBHOOK_VERIFY_TOKEN` on Vercel = `my_secret_verify_token` |
| DMs not sending | App needs `instagram_manage_messages` permission approved |
