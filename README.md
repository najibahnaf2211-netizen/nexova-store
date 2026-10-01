# NEXOVA Premium Store

একটি premium customer storefront + আলাদা admin panel + cart + checkout + courier charge + Bengali AI shopping assistant-এর ready-to-run project.

## Run

Node.js 18+ লাগবে। `npm install` দরকার নেই—server built-in Node modules ব্যবহার করে।

```bash
node server/index.js
```

তারপর:

- Customer site: `http://localhost:3000/customer/`
- Admin panel: `http://localhost:3000/admin/`

## Admin demo login

- Email: `admin@nexova.local`
- Password: `change-this-password`

Production-এ environment variable দিয়ে password পরিবর্তন করুন।

```text
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your-strong-password
PORT=3000
```

AI assistant-এর জন্য server-side OpenAI key দিতে পারেন:

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6-luna
OPENAI_BASE_URL=https://api.openai.com/v1/responses
```

Key frontend-এর JavaScript-এ রাখবেন না। API key না থাকলেও NEXOVA assistant product search ও Bengali fallback mode-এ কাজ করবে।

## Included

- 1-second animated “Welcome To NEXOVA” intro
- Premium dark / gold clean interface
- NEXOVA logo support + admin logo change/delete
- 8 main categories
- Men subcategories: Bracelet, Watch, Sunglass, Shirt, T-Shirt, Pant, Perfume, Helmet, Accessories
- Women subcategories: শাড়ী, জামা, এক্সেসরিস, কসমেটিকস, ব্যাগ, জুয়েলারি, পারফিউম, অন্যান্য
- Combo, Gift Box, Kids, Gadgets, Beauty
- High / Mid / Low / Discount / Hot filters
- Search + sort
- Product details modal
- Order Now + Add to Cart
- Multi-product cart
- Color and Size options per product, separately ON/OFF
- Stock / Out of Stock
- Courier charge: Dhaka / Outside Dhaka
- Customer order form + order ID
- Separate Admin Panel
- Product add/edit/delete + images + price + discount + range + flags + stock
- Homepage option visibility and subcategory editing
- Customer product views count
- Customer orders in Admin Panel
- Order status control
- WhatsApp support: 01882243588
- Facebook Page and Owner links prefilled

## Important production note

এই version-এ data `server/data/db.json`-এ রাখা হয়, তাই local/demo use-এর জন্য সহজ। Production-এ multi-device persistent order system চালাতে a real database (যেমন Supabase/Postgres) যুক্ত করা উচিত। UI এবং API structure সেই integration-এর জন্য সহজে extend করা যাবে।

`server/data/db.json`-এ থাকা demo image URLs এবং products Admin Panel থেকে replace/add/edit করা যাবে।
