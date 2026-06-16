# 🧺 Feira — Project Guide (for beginners)

This document explains, in plain language, **what Feira is**, **what has been built
so far**, **how the project is put together**, and **what you should do next**. No
prior coding knowledge is assumed — if a word looks technical, there's a short
explanation right next to it.

---

## 1. What is Feira?

Feira is a **marketplace website** where small farmers can sell their fruit,
vegetables and roots **directly to buyers** — no supermarket in the middle.
("Feira" is the Portuguese word for an open-air farmers' market.)

There are two kinds of people who use it:

- **Buyers** — browse the produce, put what they want in a basket, and send their
  order to the farmer on **WhatsApp**.
- **Farmers** — create a little profile about themselves, then post the products
  they have for sale (with a photo, price, and how much they harvested).

> ⚠️ **Important:** What we have today is a **mock-up** (also called a *prototype*).
> It looks and feels like the real thing, but it uses **pretend data** and runs
> entirely **inside your web browser**. There is no central server yet, so two
> different people on two different computers do **not** see each other's data.
> Think of it as a very convincing demo you can click through.

---

## 2. What has been built so far

### For buyers
- A **home page** showing a grid of produce (avocados, oranges, sweet potato,
  tomatoes, kale, corn, lemons, cassava…), each with a price per kilo and a
  "harvested today / yesterday" label.
- **Search** and **category filters** (Fruit / Vegetables / Roots) to find things.
- A **farmer profile** you can open to read about the grower, where they are, and
  everything they currently have in season.
- A **basket** (shopping cart) where you choose how many kilos you want.
- **Checkout on WhatsApp.** This is the clever part: if your basket has items from
  two different farmers, Feira **splits the order automatically** and prepares a
  **separate WhatsApp message for each farmer** — each one only sees their own
  items. For example, "5 kg of sweet potato" goes to Farmer 1 and "2 kg of
  avocado" goes to Farmer 2.
- An **order confirmation** screen after you place an order, plus an **Orders
  history** (the 🧾 icon at the top) listing everything you've ordered.
- When you order, the farmer's **available stock goes down**, and a product can
  show as **"Sold out"**.

### For farmers
- **"Sell with us" / sign up** — set up your stand with your name, farm name,
  location, WhatsApp number, a short bio, and a **profile photo** (or pick an
  avatar emoji).
- **Post a product** — upload a **real photo** of your produce (or pick an icon),
  give it a name, set the price per kilo, how many kilos you have, when you
  harvested it, and a short description. It appears on the marketplace instantly.
- A **"My stand"** view showing only your own listings.

### Nice touches
- **Your data is remembered.** Listings, your account, your basket, and your order
  history are saved in the browser, so they're still there after you refresh the
  page. (Technical name: *localStorage* — a small storage box the browser keeps
  for each website.)
- **Reset demo data** link in the footer wipes everything and starts fresh.
- **Photos are automatically shrunk** when uploaded, so they load fast and fit in
  the browser's storage.
- Small **pop-up messages** ("toast" notifications) confirm actions like adding to
  the basket or posting a product.

---

## 3. How the project is organised

You don't need to memorise this, but it helps to know where things live. The
project is a **website built with two popular tools**:

- **React** — a tool for building web pages out of reusable building blocks called
  *components* (e.g. a "product card" is one component, reused for every product).
- **Vite** — the tool that runs the project on your computer and bundles it for the
  web. (Think of it as the "engine" that turns the code into a working website.)

Here are the main files and folders:

```
Feira/
├── index.html            ← the single web page everything loads into
├── package.json          ← the project's settings + list of tools it needs
├── README.md             ← short overview of the project
├── GUIDE.md              ← (this file)
└── src/                  ← all the actual code lives here
    ├── main.jsx          ← the starting point that boots the app
    ├── App.jsx           ← the "brain": holds all the data and ties everything together
    ├── data.js           ← the fake starter data (the sample farmers & produce)
    ├── styles.css        ← all the visual styling (colours, layout, spacing)
    ├── utils.js          ← small helpers (e.g. formatting prices, building the WhatsApp message)
    ├── image.js          ← shrinks uploaded photos so they fit in storage
    ├── usePersistentState.js  ← the bit that remembers data after a refresh
    └── components/       ← the reusable visual building blocks
        ├── ProductCard.jsx       ← one produce tile on the home grid
        ├── CartDrawer.jsx        ← the slide-out basket
        ├── CheckoutModal.jsx     ← the "send your orders on WhatsApp" pop-up
        ├── SignUpModal.jsx       ← the farmer sign-up form
        ├── PostProductModal.jsx  ← the "post a product" form
        ├── ProducerModal.jsx     ← a farmer's profile pop-up
        ├── OrdersModal.jsx       ← the buyer's order history
        ├── ConfirmationModal.jsx ← the "order placed!" success screen
        ├── ImageUpload.jsx       ← the click-to-upload photo box
        └── Toasts.jsx            ← the little pop-up confirmation messages
```

> A file ending in **`.jsx`** is a React component (a visual piece). A **`.js`**
> file is plain helper logic. A **`.css`** file controls how things look.

---

## 4. How to run it on your own computer

You only need to do this if you want to see it locally. Steps:

1. **Install Node.js** (this gives you the `npm` command). Download the "LTS"
   version from <https://nodejs.org> and install it.
2. Open a **terminal** (Command Prompt on Windows, Terminal on Mac) and go into the
   project folder.
3. The first time only, install the project's tools:
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. The terminal will print a web address like `http://localhost:5173`. Open that in
   your browser and you'll see Feira running.

Other useful commands:
- `npm run build` — creates an optimised version ready to publish (into a `dist/`
  folder).
- `npm run preview` — shows you that optimised version locally.

---

## 5. Where the code lives (git & branches)

- The code is stored on **GitHub** (an online home for code).
- All this work is on a **branch** (a separate line of work) called
  **`claude/farmer-marketplace-mockup-5gavo1`**. A branch lets you build something
  without disturbing the main copy.
- When you're happy with it, the branch can be **merged** into the `main` branch so
  it becomes the official version. (On GitHub this is done with a "Pull Request".)

---

## 6. What this mock-up does NOT do yet

Being honest about the limits, so there are no surprises:

- ❌ **No real accounts or login.** Anyone can "sign up" instantly; there are no
  passwords and nothing is verified.
- ❌ **No shared/central data.** Each person's browser keeps its own copy. If a
  farmer posts a product on their laptop, a buyer on their phone won't see it.
- ❌ **The WhatsApp numbers are fake.** The checkout *opens* WhatsApp with a
  ready-written message, but the demo phone numbers don't belong to real farmers.
- ❌ **No payments.** Money is handled "offline" between buyer and farmer.
- ❌ **Not published online yet.** It runs on your computer, not at a public web
  address people can visit.

These aren't bugs — they're simply the natural next stages of the project.

---

## 7. Next steps (recommended order)

Here's a sensible path from "demo" to "real product". You can stop at any point.

### Step 1 — Put it online so you can share it 🔗 *(easiest, do this first)*
Right now only you can see it. Publishing it gives you a **public link** you can
open on your phone and send to friends or potential users for feedback.
- Easiest options: **Vercel** or **Netlify** — both have a free tier and can publish
  a project like this in a few clicks by connecting your GitHub.
- **Why first?** It's quick, costs nothing, and getting real people to click around
  is the fastest way to learn what to improve.

### Step 2 — Add a real backend (a shared database) 🗄️
This is the big one that turns the demo into a real app. A **backend** is a central
computer that stores everyone's data in one place (a **database**), so every visitor
sees the same farmers and products.
- Beginner-friendly options: **Supabase** or **Firebase** — they give you a
  database, file storage (for real photos), and login **without** you having to
  build a server from scratch.
- This replaces the "save in the browser" trick we use today.

### Step 3 — Real accounts and login 🔐
So farmers can log back in from any device and manage *their* listings securely
(with a password or "sign in with Google"). Supabase/Firebase from Step 2 include
this.

### Step 4 — Real photo storage 🖼️
Today photos live inside the browser. With a backend you can store them properly so
they're shared and don't take up browser space.

### Step 5 — Polish the real-world flow 🚚
- Let farmers see and confirm incoming orders (not only WhatsApp).
- Add pickup vs delivery options, opening hours, and a map of where the farm is.
- Ratings and reviews so buyers can trust new farmers.

### Step 6 — Payments (optional, later) 💳
If you ever want to handle money in-app, services like **Stripe** or **Mercado
Pago** (popular in Brazil) can be added. Many small-farm marketplaces happily skip
this and keep payment between buyer and farmer.

---

## 8. A simple way to think about it

> **Today:** a beautiful, clickable demo that lives in one browser.
> **Step 1:** the same demo, but online and shareable.
> **Steps 2–4:** a real app where everyone shares the same data and can log in.
> **Steps 5–6:** the finishing touches that make it feel like a finished product.

You don't have to do it all at once. Each step adds one solid layer on top of the
last. 🌱

---

*Questions to consider before the next step:* Who will use it first — farmers you
know, or buyers? Which region/city? Will it be in English or Portuguese? Your
answers help decide what to build next.
