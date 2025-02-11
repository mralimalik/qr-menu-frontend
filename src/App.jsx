import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import MenuHome from "./pages/MenuHome/MenuHome.jsx";
import VenueLayout from "./pages/Layout/Layout.jsx";
import ItemDetail from "./pages/ItemDetailPage/ItemDetail.jsx";
import Cart from "./pages/CartPage/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import OrderSummary from "./pages/OrderSummary/OrderSummary.jsx";
import OrderStatus from "./pages/OrderStatus/OrderStatus.jsx";
import PaymentStatusPage from "./pages/PaymentStatusPage/PaymentStatusPage.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="h-screen w-full flex justify-center items-center">
              Nothing Found
            </div>
          }
        />

        {/* Define a route with a dynamic parameter */}
        <Route path="/:venueId" element={<VenueLayout />}>
          <Route
            path="/:venueId/order-status/:orderId"
            element={<OrderStatus />}
          />
          {/* Nested routes */}
          <Route path="" element={<Home />} /> {/* Default nested route */}
          <Route path="menu/:menuId" element={<MenuHome />} />
          <Route path="menu/:menuId/cart" element={<Cart />} />
          <Route path="menu/:menuId/checkout" element={<Checkout />} />
          <Route path="menu/:menuId/payment-status" element={<PaymentStatusPage />} />

          <Route
            path="menu/:menuId/order-summary/:orderId"
            element={<OrderSummary />}
          />
          <Route path="menu/:menuId/item/:itemId" element={<ItemDetail />} />
          <Route path="order-status" element={<OrderStatus />} />
          <Route path="order-status/:orderId" element={<OrderStatus />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
