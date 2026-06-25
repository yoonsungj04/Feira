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
import { Basket, Search, Receipt, Plus, Pin, Sprout } from './components/Icons.jsx'

const KEY = 'feira.v2'

export default function App() {
  // Mantido entre os recarregamentos da página.
  const [producers, setProducers] = usePersistentState(`${KEY}.producers`, seedProducers)
  const [products, setProducts] = usePersistentState(`${KEY}.products`, seedProducts)
  const [me, setMe] = usePersistentState(`${KEY}.me`, null)
  const [cart, setCart] = usePersistentState(`${KEY}.cart`, {})
  const [orders, setOrders] = usePersistentState(`${KEY}.orders`, [])

  // Estado de interface (não persistido).
  const [cartOpen, setCartOpen] = useState(false)
  const [category, setCategory] = useState('Tudo')
  const [query, setQuery] = useState('')
  const [view, setView] = useState('market') // 'market' | 'mine'
  const [modal, setModal] = useState(null) // 'signup' | 'post' | 'checkout' | 'orders' | 'confirmed'
  const [activeProducer, setActiveProducer] = useState(null)
  const [lastOrder, setLastOrder] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, image) => {
    const id = uid('toast')
    setToasts((t) => [...t, { id, message, image }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const producerById = useMemo(
    () => Object.fromEntries(producers.map((p) => [p.id, p])),
    [producers],
  )

  const visibleProducts = useMemo(() => {
    let list = products
    if (view === 'mine' && me) list = list.filter((p) => p.producerId === me.id)
    if (category !== 'Tudo') list = list.filter((p) => p.category === category)
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

  // Agrupa o cesto por produtor para o checkout no WhatsApp.
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
    addToast(`${product.name} no cesto`, product.photo)
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
    const newProducer = { ...data, id: uid('me') }
    setProducers((p) => [newProducer, ...p])
    setMe(newProducer)
    setModal(null)
    addToast('Sua barraca está no ar!')
  }

  const handlePost = (data) => {
    const product = { ...data, id: uid('prod'), producerId: me.id }
    setProducts((p) => [product, ...p])
    setModal(null)
    setView('mine')
    addToast(`${data.name} foi pra feira`, product.photo)
  }

  // Transforma o cesto num pedido: salva no histórico, baixa o estoque e esvazia o cesto.
  const placeOrder = ({ buyerName, groups }) => {
    const order = {
      id: uid('order'),
      date: new Date().toISOString(),
      buyerName,
      total: groups.reduce((s, g) => s + g.total, 0),
      groups: groups.map((g) => ({
        producerName: g.producer.name,
        producerPhoto: g.producer.photo,
        total: g.total,
        lines: g.lines.map((l) => ({
          name: l.product.name,
          image: l.product.photo,
          qty: l.qty,
          unit: l.product.unit,
          lineTotal: l.qty * l.product.pricePerKg,
        })),
      })),
    }

    // Baixa o estoque de tudo que foi pedido.
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
    if (!confirm('Recomeçar a demonstração? Isso apaga todos os anúncios, contas e pedidos salvos no seu navegador.')) return
    Object.keys(localStorage)
      .filter((k) => k.startsWith(KEY))
      .forEach((k) => localStorage.removeItem(k))
    location.reload()
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={() => setView('market')}>
          <span className="brand-logo"><Basket size={30} /></span>
          <div>
            <span className="brand-name">Feira</span>
            <span className="brand-tag">fresquinho, direto do produtor</span>
          </div>
        </div>

        <div className="search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produto ou produtor…"
          />
        </div>

        <div className="topbar-actions">
          {me ? (
            <>
              <button className="btn btn-primary btn-icon" onClick={() => setModal('post')}>
                <Plus size={16} /> Anunciar produto
              </button>
              <button
                className={`btn btn-ghost ${view === 'mine' ? 'active' : ''}`}
                onClick={() => setView(view === 'mine' ? 'market' : 'mine')}
              >
                {view === 'mine' ? 'Ver a feira' : 'Minha barraca'}
              </button>
              <span className="me-chip" title={me.name}
                style={me.photo ? { backgroundImage: `url(${me.photo})`, backgroundSize: 'cover' } : undefined} />
            </>
          ) : (
            <button className="btn btn-ghost" onClick={() => setModal('signup')}>
              Vender na feira
            </button>
          )}
          <button className="cart-btn ghost-icon" onClick={() => setModal('orders')} title="Seus pedidos">
            <Receipt size={20} />
            {orders.length > 0 && <span className="cart-badge">{orders.length}</span>}
          </button>
          <button className="cart-btn btn-icon" onClick={() => setCartOpen(true)}>
            <Basket size={20} /> Cesto
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {view === 'market' && (
        <section className="hero">
          <div className="hero-text">
            <span className="hero-eyebrow"><Sprout size={14} /> Colhido esta semana, pertinho de você</span>
            <h1>Comida de verdade, direto de <em>quem planta</em>.</h1>
            <p>
              Veja o que os pequenos produtores colheram esta semana, encha seu cesto e faça o pedido
              direto no WhatsApp. Sem supermercado no meio do caminho.
            </p>
            {!me && (
              <button className="btn btn-primary btn-lg" onClick={() => setModal('signup')}>
                Sou produtor — quero vender
              </button>
            )}
          </div>
          <div className="hero-stats">
            <div><strong>{producers.length}</strong><span>produtores</span></div>
            <div><strong>{products.length}</strong><span>anúncios fresquinhos</span></div>
            <div><strong>0%</strong><span>atravessador</span></div>
          </div>
        </section>
      )}

      {view === 'mine' && me && (
        <section className="mine-banner">
          <span className={`producer-hero-avatar ${me.photo ? 'photo' : ''}`}
            style={me.photo ? { backgroundImage: `url(${me.photo})` } : undefined} />
          <div className="mine-banner-info">
            <h1>{me.name}</h1>
            <p className="muted with-pin">{me.farmer} · <Pin size={14} /> {me.location}</p>
            {me.bio && <p className="mine-bio">{me.bio}</p>}
          </div>
          <button className="btn btn-primary btn-icon" onClick={() => setModal('post')}><Plus size={16} /> Anunciar produto</button>
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
        <span className="filters-count">{visibleProducts.length} itens</span>
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
            <span><Sprout size={46} /></span>
            <p>
              {view === 'mine'
                ? 'Você ainda não anunciou nada. Toque em “Anunciar produto” pra colocar o primeiro.'
                : 'Nenhum produto combina com a sua busca.'}
            </p>
          </div>
        )}
      </main>

      <footer className="site-foot">
        <span className="foot-brand"><Basket size={16} /> Feira — uma feira-demonstração que liga pequenos produtores e quem compra perto.</span>
        <button className="link-btn" onClick={resetDemo}>Recomeçar a demonstração</button>
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

      <nav className="mobilebar">
        <button className={view === 'market' ? 'active' : ''} onClick={() => { setView('market'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <span><Sprout size={20} /></span>Feira
        </button>
        <button onClick={() => setModal('orders')}>
          <span className="mb-icon"><Receipt size={20} />{orders.length > 0 && <i>{orders.length}</i>}</span>Pedidos
        </button>
        {me && (
          <button onClick={() => setModal('post')}>
            <span><Plus size={20} /></span>Anunciar
          </button>
        )}
        <button onClick={() => setCartOpen(true)}>
          <span className="mb-icon"><Basket size={20} />{cartCount > 0 && <i>{cartCount}</i>}</span>Cesto
        </button>
      </nav>

      <Toasts toasts={toasts} />
    </div>
  )
}
