# NEXOVA Luxury Store — Free Hosting Package

## Included
- Premium responsive storefront
- Left category navigation + mobile drawer
- Search, sorting, wishlist
- Product detail + Order Now
- Multi-product cart + checkout
- COD / bKash / Nagad / Rocket / Online Payment selections
- WhatsApp order handoff
- Admin panel: add/edit/delete products, discounts, tags and orders
- NEXOVA AI chat UI
- Optional Vercel serverless `/api/chat.js` for real OpenAI-powered chat

## Demo Admin Login
User ID: `Nexova`
Password: `Sajid001188`

IMPORTANT: This login is client-side for the free static demo. Anyone who can inspect the website files can discover it. For a real business, use server-side authentication/database.

## Free deployment
### Vercel
1. Upload this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Deploy with the default settings.
4. You will get a free `*.vercel.app` address.

### GitHub Pages
The storefront can also run as a static GitHub Pages site. The admin and browser-local order storage are demo features; shared production orders require a database/backend.

## Payments
The payment buttons/options are UI-ready. Live bKash/Nagad/Rocket/online payment processing requires the appropriate merchant credentials and a supported payment gateway/backend. Those credentials should never be exposed in client-side code.

## AI
The visible storefront includes a local shopping assistant. For real OpenAI-powered replies, deploy `api/chat.js` on Vercel and set `OPENAI_API_KEY` as a Vercel environment variable. API usage may incur separate charges; hosting can remain free within the hosting provider's free allowance.
