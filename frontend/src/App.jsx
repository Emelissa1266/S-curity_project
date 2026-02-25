import { Routes, Route } from 'react-router-dom'
import ClientLayout from './layouts/ClientLayout'
import VendeurLayout from './layouts/VendeurLayout'
import ProtectedVendeur from './components/ProtectedVendeur'
import Home from './client/Home'
import Products from './client/Products'
import Cart from './client/Cart'
import Checkout from './client/Checkout'
import VendeurDashboard from './vendeur/Dashboard'
import VendeurProducts from './vendeur/Products'
import VendeurOrders from './vendeur/Orders'
import Login from './auth/Login'
import Signup from './auth/Signup'
import Profile from './auth/Profile'

function App() {
  return (
    <Routes>
      {/* Auth (layout minimal) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Interface Client */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Interface Vendeur (protégée) */}
      <Route path="/vendeur" element={
        <ProtectedVendeur>
          <VendeurLayout />
        </ProtectedVendeur>
      }>
        <Route index element={<VendeurDashboard />} />
        <Route path="products" element={<VendeurProducts />} />
        <Route path="orders" element={<VendeurOrders />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
