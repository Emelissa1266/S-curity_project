import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ventre-cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('ventre-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.productId === product.id)
      if (existing) {
        return prev.map(p =>
          p.productId === product.id
            ? { ...p, quantity: p.quantity + quantity }
            : p
        )
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(p => p.productId !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId)
    setCart(prev =>
      prev.map(p =>
        p.productId === productId ? { ...p, quantity } : p
      )
    )
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
