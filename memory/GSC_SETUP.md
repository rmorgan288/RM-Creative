# Google Search Console — Setup Guide

Domain: **rhysmorgan.studio**
Sitemap URL (once live): **https://rhysmorgan.studio/sitemap.xml**
Robots URL: **https://rhysmorgan.studio/robots.txt**

---

## Step 1 — Add the property in Google Search Console

1. Go to **https://search.google.com/search-console**
2. Sign in with the Google account you want to own the analytics
3. Click **Add property** → choose **URL prefix** (simpler than Domain) and enter:
   ```
   https://rhysmorgan.studio/
   ```
4. Google will offer several verification methods. **Use HTML tag** (easiest given this is a React/SPA site).

## Step 2 — Copy the verification code

Google will show a snippet like this:
```html
<meta name="google-site-verification" content="abc123XyZ..._yourCode_..." />
```

Copy the value of `content="…"` (just the code itself, e.g. `abc123XyZ...`).

## Step 3 — Paste the code into the site

In `/app/frontend/public/index.html`, find this line (already prepared for you):
```html
<meta name="google-site-verification" content="REPLACE_WITH_GSC_CODE" />
```

Replace `REPLACE_WITH_GSC_CODE` with your real code. Save the file. Deploy.

## Step 4 — Verify

Back in Google Search Console, click **Verify**. Google will fetch `https://rhysmorgan.studio/` and look for the tag.

> If verification fails: open https://rhysmorgan.studio/ in an incognito tab, View Source, and search for `google-site-verification` — the tag must be present in the raw HTML response (it is, since it's in `public/index.html`).

## Step 5 — Submit the sitemap

Once verified, in Search Console's left nav:

1. Click **Sitemaps**
2. Enter `sitemap.xml` in the "Add a new sitemap" field
3. Click **Submit**

Google should report "Success" within a few minutes. It can take 1–7 days for indexing to actually populate.

## Step 6 (optional) — Bing Webmaster Tools

Same flow but at **https://www.bing.com/webmasters**. The site already has a `msvalidate.01` meta slot ready to paste the Bing code into.

---

## What you should see after 1–2 weeks

- **Coverage**: shows the homepage indexed
- **Performance**: queries you're ranking for (look for "graphic designer blaenau gwent", "creative director south wales", "rhys morgan")
- **Enhancements**: any rich result eligibility from your JSON-LD (Person + LocalBusiness)

## Validating your structured data right now

Even before submission, you can test the JSON-LD using Google's Rich Results tester:
- https://search.google.com/test/rich-results — paste `https://rhysmorgan.studio/` once deployed
- Or run on `view-source:https://rhysmorgan.studio/` and search for `application/ld+json` — the schema block is in the raw HTML

## Quick checklist

- [ ] Paste GSC code in `public/index.html`
- [ ] Deploy
- [ ] Click **Verify** in Search Console
- [ ] Submit `sitemap.xml`
- [ ] Test rich results with Google's tester
- [ ] (Optional) Repeat for Bing Webmaster Tools
