import { useMemo, useState } from 'react'
import { producers as seedProducers, products as seedProducts, categories } from './data.js'
import { formatPrice } from './utils.js'
import ProductCard from './components/ProductCard.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import CheckoutModal from './components/CheckoutModal.jsx'
import SignUpModal from './components/SignUpModal.jsx'
import PostProductModal from './components/PostProductModal.jsx'
import ProducerModal from './components/ProducerModal.jsx'

let nextId = 100

export default function App() {
  const [producers, setProducers] = useState(seedProducers)
  const [products, setProducts] = useState(seedProducts)
  const [me, setMe] = useState(null) // the logged-in farmer, once they sign up

  const [cart, setCart] = useState({}) // productId -> qty in kg
  const [cartOpen, setCartOpen] = useState(false)

  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [view, setView] = useState('market') // 'market' | 'mine'

  const [modal, setModal] = useState(null) // 'signup' | 'post' | 'checkout'
  const [activeProducer, setActiveProducer] = useState(null)

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
    setCart((c) => ({ ...c, [product.id]: Math.min((c[product.id] || 0) + amount, product.available) }))
    setCartOpen(true)
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
    const id = `me-${nextId++}`
    const newProducer = { ...data, id }
    setProducers((p) => [newProducer, ...p])
    setMe(newProducer)
    setModal(null)
  }

  const handlePost = (data) => {
    const product = { ...data, id: `prod-${nextId++}`, producerId: me.id }
    setProducts((p) => [product, ...p])
    setModal(null)
    setView('mine')
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
              <span className="me-chip" title={me.name}>{me.avatar}</span>
            </>
          ) : (
            <button className="btn btn-ghost" onClick={() => setModal('signup')}>
              Sell with us
            </button>
          )}
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
          <span className="producer-hero-avatar">{me.avatar}</span>
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
          buyerName=""
          onClose={() => setModal(null)}
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
    </div>
  )
}
