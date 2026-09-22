# Pranjal & Vaishali — Wedding Web Invitation

Premium static wedding invitation for **15 February 2027** in **Bilaspur, Chhattisgarh**.

No build step is required. The site is plain HTML, CSS, and JavaScript (ES modules).

## Local preview

From **this project folder** (not the parent `Personal` folder):

```bash
cd pranjal-vaishali-wedding-invite
npm run dev
```

Open **http://localhost:3000** — the invitation loads directly.

If you run `python3 -m http.server 3000` from the parent `Personal` folder instead, open **http://localhost:3000** and you will be redirected into this site automatically.

Do not open `index.html` via `file://` — ES modules require HTTP.

## Configuration

Edit **`js/config.js`** for couple names, date, venue, map link, WhatsApp/phone, and image paths.

Edit **`js/data.js`** for the event schedule and story/invitation copy.

## Assets

Replace SVG placeholders under `assets/images/` with your photos (`.jpg` or `.webp`). Update paths in `js/config.js` if filenames change.

Add licensed background music at:

`assets/audio/wedding-music.mp3`

The music button hides automatically if the file is missing.

See **`docs/ASSETS.md`** for a full asset checklist.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch `main` and folder **`/ (root)`** (or `/docs` if you host from a subfolder).
5. Save. Your site will be available at `https://<username>.github.io/<repo>/`.

If the site lives in a subfolder, set relative paths accordingly (this project uses relative paths from the site root).

## Also works on

- Netlify (drag-and-drop or connect repo, publish directory = project root)
- Vercel (static, no framework)
- Cloudflare Pages

## License

Private wedding project — use your own photos and music only.
