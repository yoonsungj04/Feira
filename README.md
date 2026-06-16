# 🧺 Feira

A mock-up of a **marketplace where small farmers sell fresh produce directly to local buyers** — no supermarket in between. *Feira* is Portuguese for an open-air farmers' market.

> This is an interactive front-end mock-up with fake data. There's no server yet — accounts, listings, your basket and order history are **saved in your browser** (localStorage), so they survive a refresh. Use **Reset demo data** in the footer to start fresh.

## What you can do

### As a buyer
- **Browse** what farmers harvested this week on the main page, filter by category (Fruit / Vegetables / Roots) or search.
- **Open a farmer's profile** to read about them, where they are, and everything they have in season.
- **Add produce to a basket** and adjust the amount in kilos.
- **Checkout on WhatsApp**: the basket is automatically **split by farmer**, so each grower receives their own ready-to-send WhatsApp message with only their items (e.g. 5 kg of sweet potato goes to Producer 1, 2 kg of avocado goes to Producer 2).
- **Place the order** to get a confirmation, and find everything later in your **Orders** history (🧾). Ordering reduces each farmer's available stock, and items can sell out.

### As a farmer
- **"Sell with us"** to set up your stand — your name, farm name, location, WhatsApp, a short bio, and a **real profile photo** (or pick an avatar).
- **Post a product** in seconds: **upload a real photo** (auto-resized to stay small), or pick an icon — then name it, set the price per kg, the amount available, when it was harvested, and a short description.
- Your listings appear immediately on the main marketplace and under **My stand**.

## Tech

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) — no backend, all state is in-memory.
- Plain CSS, no UI framework.

## Run it locally

```bash
npm install
npm run dev      # start the dev server (prints a local URL)
```

Other scripts:

```bash
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Notes for the demo

- Producer phone numbers are **fake placeholders** used only to build the `wa.me` links.
- Prices are shown in Brazilian Reais (R$).
- Data is stored per-browser. To wipe it, use **Reset demo data** in the footer.

## Possible next steps

- A real backend with accounts so data is shared across devices and users
- Order tracking / confirmation from the farmer's side
- Ratings & reviews, delivery vs pickup options
- A public deployment (e.g. Vercel) for a shareable link
