# 🧺 Feira

A mock-up of a **marketplace where small farmers sell fresh produce directly to local buyers** — no supermarket in between. *Feira* is Portuguese for an open-air farmers' market.

> This is an interactive front-end mock-up with fake data. There's no backend yet — accounts, listings and the basket live in the browser for the session.

## What you can do

### As a buyer
- **Browse** what farmers harvested this week on the main page, filter by category (Fruit / Vegetables / Roots) or search.
- **Open a farmer's profile** to read about them, where they are, and everything they have in season.
- **Add produce to a basket** and adjust the amount in kilos.
- **Checkout on WhatsApp**: the basket is automatically **split by farmer**, so each grower receives their own ready-to-send WhatsApp message with only their items (e.g. 5 kg of sweet potato goes to Producer 1, 2 kg of avocado goes to Producer 2).

### As a farmer
- **"Sell with us"** to set up your stand — your name, farm name, location, WhatsApp and a short bio about yourself and how you grow.
- **Post a product** in seconds: pick a picture, name it, set the price per kg, the amount available, when it was harvested, and a short description.
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
- Refreshing the page resets everything to the seed data.

## Possible next steps

- Real accounts & authentication
- A database so listings and orders persist
- Image uploads instead of emoji pictures
- Order tracking / confirmation from the farmer side
