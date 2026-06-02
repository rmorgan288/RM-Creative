# Google Analytics 4 — Setup Guide

Domain: **rhysmorgan.studio**

You said you'll handle GA4 setup yourself. The site is **already prepped** — you just need to:
1. Create the GA4 property and grab the Measurement ID
2. Paste the ID into two spots in `public/index.html`
3. Uncomment the snippet
4. Deploy

That's it. No additional development work needed on this side.

---

## Step 1 — Create the GA4 property

1. Go to **https://analytics.google.com**
2. **Admin** (gear icon, bottom-left) → **Create** → **Property**
3. Property name: `Rhys Morgan Studio`
4. Time zone: `(GMT+00:00) United Kingdom`
5. Currency: `British Pound (GBP)`
6. Business details — pick anything sensible (industry: Arts & Entertainment)
7. **Create a data stream** → choose **Web**
   - Website URL: `https://rhysmorgan.studio`
   - Stream name: `Production site`
8. GA4 will display your **Measurement ID** — format: `G-XXXXXXXXXX`. Copy it.

## Step 2 — Drop the ID into the site

Open `/app/frontend/public/index.html`. Find this block:

```html
<!--
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
</script>
-->
```

1. Replace **both** `G-XXXXXXXXXX` with your real Measurement ID
2. Remove the surrounding `<!--` and `-->` comment markers
3. Save → deploy

## Step 3 — Verify

1. Visit your live site `https://rhysmorgan.studio`
2. In GA4, go to **Reports → Realtime**
3. You should see "1 active user" within 30 seconds

If nothing shows: open DevTools → Network → filter `collect` — you should see a request to `google-analytics.com/g/collect`. If you do, GA is firing; the Realtime panel just lags by ~30s.

---

## Optional polish

### Link GA4 to Search Console (highly recommended)
Once both are live:
- GA4 Admin → **Search Console links** → **Link**
- Pick the `rhysmorgan.studio` property you set up in the GSC guide
- You'll get a combined "Search Console" report inside GA4 showing queries + on-site behaviour together

### Privacy / GDPR
The snippet already includes `anonymize_ip: true`. If you want full cookie-consent compliance for UK/EU visitors, consider adding a tool like **Cookiebot** or **Klaro** later — but for a portfolio site with no tracking pixels beyond GA, the current setup is reasonable and proportionate.

### What to look at after 1–2 weeks
- **Reports → Acquisition → Traffic acquisition** — where visits come from (Google search, direct, LinkedIn, etc.)
- **Reports → Engagement → Pages and screens** — which case studies hold attention longest
- **Reports → Engagement → Events** — defaults include `page_view`, `scroll`, `click`, `form_submit` (no extra setup needed)

---

## Quick checklist

- [ ] Create GA4 property at analytics.google.com
- [ ] Copy Measurement ID (`G-XXXXXXXXXX`)
- [ ] Paste into both spots in `public/index.html`
- [ ] Remove the `<!-- -->` comment markers around the snippet
- [ ] Deploy
- [ ] Verify in **Realtime** report
- [ ] Link to Search Console
