import { useMemo, useState, useCallback } from 'react'
import { producers as seedProducers, products as seedProducts, categories } from './data.js'
import { usePersistentState } from './usePersistentState.js'
import { uid } from './image.js'
import ProductCard from './components/ProductCard.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import CheckoutModal from './components/CheckoutModal.jsx'
import SignUpModal from './components/SignUpModal.jsx'
import PostProductModal from './components/PostProductModal.jsx'
import ProducerModal from './components/ProducerModal.jsx'
import OrdersModal from './components/OrdersModal.jsx'
import ConfirmationModal from './components/ConfirmationModal.jsx'
import Toasts from './components/Toasts.jsx'

const KEY = 'feira.v1'

export default function App() {
  // Persisted across refreshes.
  const [producers, setProducers] = usePersistentState(`${KEY}.producers`, seedProducers)
  const [products, setProducts] = usePersistentState(`${KEY}.products`, seedProducts)
  const [me, setMe] = usePersistentState(`${KEY}.me`, null)
  const [cart, setCart] = usePersistentState(`${KEY}.cart`, {})
  const [orders, setOrders] = usePersistentState(`${KEY}.orders`, [])

  // Ephemeral UI state.
  const [cartOpen, setCartOpen] = useState(false)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [view, setView] = useState('market') // 'market' | 'mine'
  const [modal, setModal] = useState(null) // 'signup' | 'post' | 'checkout' | 'orders' | 'confirmed'
  const [activeProducer, setActiveProducer] = useState(null)
  const [lastOrder, setLastOrder] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, emoji) => {
    const id = uid('toast')
    setToasts((t) => [...t, { id, message, emoji }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const producerById = useMemo(
    () => Object.fromEntries(producers.map((p) => [p.id, p])),
    [producers],
  )

  const visibleProducts = useMemo(() => {
    let list = products
    if (view === 'mine' && me) list = list.filter((p) => p.producerId === me.id)
    if (category !== 'All') list = list.filter((p) => p.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          producerById[p.producerId]?.name.toLowerCase().includes(q),
      )
    }
    return list
  }, [products, view, me, category, query, producerById])

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const product = products.find((p) => p.id === id)
          if (!product) return null
          return { product, producer: producerById[product.producerId], qty }
        })
        .filter(Boolean),
    [cart, products, producerById],
  )

  const cartTotal = cartLines.reduce((sum, l) => sum + l.qty * l.product.pricePerKg, 0)
  const cartCount = cartLines.reduce((sum, l) => sum + l.qty, 0)

  // Group the basket by producer for the WhatsApp checkout.
  const checkoutGroups = useMemo(() => {
    const map = new Map()
    for (const line of cartLines) {
      const key = line.producer.id
      if (!map.has(key)) map.set(key, { producer: line.producer, lines: [], total: 0 })
      const g = map.get(key)
      g.lines.push(line)
      g.total += line.qty * line.product.pricePerKg
    }
    return [...map.values()]
  }, [cartLines])

  const addToCart = (product, amount = 5) => {
    const next = Math.min((cart[product.id] || 0) + amount, product.available)
    setCart((c) => ({ ...c, [product.id]: next }))
    setCartOpen(true)
    addToast(`${product.name} added to basket`, product.emoji)
  }

  const changeQty = (id, qty) => {
    setCart((c) => {
      if (qty <= 0) {
        const { [id]: _, ...rest } = c
        return rest
      }
      const product = products.find((p) => p.id === id)
      return { ...c, [id]: Math.min(qty, product?.available ?? qty) }
    })
  }

  const removeFromCart = (id) =>
    setCart((c) => {
      const { [id]: _, ...rest } = c
      return rest
    })

  const handleCreateStand = (data) => {
    const newProducer = { ...data, id: uid('me'), avatar: data.avatar }
    setProducers((p) => [newProducer, ...p])
    setMe(newProducer)
    setModal(null)
    addToast('Your stand is live!', '🎉')
  }

  const handlePost = (data) => {
    const product = { ...data, id: uid('prod'), producerId: me.id }
    setProducts((p) => [product, ...p])
    setModal(null)
    setView('mine')
    addToast(`${data.name} posted to the marketplace`, '🌱')
  }

  // Turn the basket into an order: save history, decrement stock, clear basket.
  const placeOrder = ({ buyerName, groups }) => {
    const order = {
      id: uid('order'),
      date: new Date().toISOString(),
      buyerName,
      total: groups.reduce((s, g) => s + g.total, 0),
      groups: groups.map((g) => ({
        producerName: g.producer.name,
        producerAvatar: g.producer.photo ? '📸' : g.producer.avatar,
        total: g.total,
        lines: g.lines.map((l) => ({
          name: l.product.name,
          emoji: l.product.emoji,
          qty: l.qty,
          unit: l.product.unit,
          lineTotal: l.qty * l.product.pricePerKg,
        })),
      })),
    }

    // Reduce available stock for everything that was ordered.
    const ordered = {}
    for (const line of cartLines) ordered[line.product.id] = line.qty
    setProducts((list) =>
      list.map((p) =>
        ordered[p.id] != null ? { ...p, available: Math.max(0, p.available - ordered[p.id]) } : p,
      ),
    )

    setOrders((o) => [order, ...o])
    setLastOrder(order)
    setCart({})
    setModal('confirmed')
  }

  const resetDemo = () => {
    if (!confirm('Reset the demo? This clears all listings, accounts and orders saved in your browser.')) return
    Object.keys(localStorage)
      .filter((k) => k.startsWith(KEY))
      .forEach((k) => localStorage.removeItem(k))
    location.reload()
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={() => setView('market')}>
          <span className="brand-logo">🧺</span>
          <div>
            <span className="brand-name">Feira</span>
            <span className="brand-tag">fresh from small farmers</span>
          </div>
        </div>

        <div className="search">
          <span>🔎</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search produce or farmers…"
          />
        </div>

        <div className="topbar-actions">
          {me ? (
            <>
              <button className="btn btn-primary" onClick={() => setModal('post')}>
                ＋ Post product
              </button>
              <button
                className={`btn btn-ghost ${view === 'mine' ? 'active' : ''}`}
                onClick={() => setView(view === 'mine' ? 'market' : 'mine')}
              >
                {view === 'mine' ? 'Browse market' : 'My stand'}
              </button>
              <span className="me-chip" title={me.name}
                style={me.photo ? { backgroundImage: `url(${me.photo})`, backgroundSize: 'cover' } : undefined}>
                {!me.photo && me.avatar}
              </span>
            </>
          ) : (
            <button className="btn btn-ghost" onClick={() => setModal('signup')}>
              Sell with us
            </button>
          )}
          <button className="cart-btn ghost-icon" onClick={() => setModal('orders')} title="Your orders">
            🧾
            {orders.length > 0 && <span className="cart-badge">{orders.length}</span>}
          </button>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🧺 Basket
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {view === 'market' && (
        <section className="hero">
          <div className="hero-text">
            <h1>Real food, straight from the people who grow it.</h1>
            <p>
              Browse what small farmers harvested this week, fill your basket, and order directly on
              WhatsApp. No supermarket in between.
            </p>
            {!me && (
              <button className="btn btn-primary btn-lg" onClick={() => setModal('signup')}>
                I'm a farmer — start selling
              </button>
            )}
          </div>
          <div className="hero-stats">
            <div><strong>{producers.length}</strong><span>farmers</span></div>
            <div><strong>{products.length}</strong><span>fresh listings</span></div>
            <div><strong>0%</strong><span>middlemen</span></div>
          </div>
        </section>
      )}

      {view === 'mine' && me && (
        <section className="mine-banner">
          <span className={`producer-hero-avatar ${me.photo ? 'photo' : ''}`}
            style={me.photo ? { backgroundImage: `url(${me.photo})` } : undefined}>
            {!me.photo && me.avatar}
          </span>
          <div className="mine-banner-info">
            <h1>{me.name}</h1>
            <p className="muted">{me.farmer} · 📍 {me.location}</p>
            {me.bio && <p className="mine-bio">{me.bio}</p>}
          </div>
          <button className="btn btn-primary" onClick={() => setModal('post')}>＋ Post product</button>
        </section>
      )}

      <div className="filters">
        {categories.map((c) => (
          <button
            key={c}
            className={`chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
        <span className="filters-count">{visibleProducts.length} items</span>
      </div>

      <main className="grid">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            producer={producerById[product.producerId]}
            inCartQty={cart[product.id] || 0}
            onAdd={addToCart}
            onOpenProducer={setActiveProducer}
          />
        ))}
        {visibleProducts.length === 0 && (
          <div className="empty-state">
            <span>🌱</span>
            <p>
              {view === 'mine'
                ? "You haven't posted anything yet. Hit “Post product” to add your first listing."
                : 'No produce matches your search.'}
            </p>
          </div>
        )}
      </main>

      <footer className="site-foot">
        <span>🧺 Feira — a mock-up marketplace connecting small farmers and local buyers.</span>
        <button className="link-btn" onClick={resetDemo}>Reset demo data</button>
      </footer>

      <CartDrawer
        open={cartOpen}
        lines={cartLines}
        total={cartTotal}
        onClose={() => setCartOpen(false)}
        onChangeQty={changeQty}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false)
          setModal('checkout')
        }}
      />

      {modal === 'signup' && (
        <SignUpModal onClose={() => setModal(null)} onCreate={handleCreateStand} />
      )}
      {modal === 'post' && me && (
        <PostProductModal onClose={() => setModal(null)} onPost={handlePost} />
      )}
      {modal === 'checkout' && (
        <CheckoutModal
          groups={checkoutGroups}
          buyerName={lastOrder?.buyerName || ''}
          onClose={() => setModal(null)}
          onConfirm={placeOrder}
        />
      )}
      {modal === 'orders' && (
        <OrdersModal orders={orders} onClose={() => setModal(null)} />
      )}
      {modal === 'confirmed' && lastOrder && (
        <ConfirmationModal
          order={lastOrder}
          onClose={() => setModal(null)}
          onViewOrders={() => setModal('orders')}
        />
      )}
      {activeProducer && (
        <ProducerModal
          producer={activeProducer}
          products={products.filter((p) => p.producerId === activeProducer.id)}
          onClose={() => setActiveProducer(null)}
          onAdd={(p) => addToCart(p)}
        />
      )}

      <Toasts toasts={toasts} />
    </div>
  )
}
