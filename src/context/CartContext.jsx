import { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const { venueId,menuId } = useParams();
  const navigate = useNavigate(); 


  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  // State to store applied charges and discounts
  const [appliedCharges, setAppliedCharges] = useState({
    tax: 0,
    serviceCharge: 0,
    discount: 0,
    delivery: 0,
  });

  const [orderData, setOrderData] = useState(null)

  const storeItemsInCartandLocal = (itemData) => {
    setCartItems((prev) => [...prev, itemData]);
  };

  const calculateTotalCartPrice = () => {
    return cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  // add item to cart from home
  const addItemToCart = (itemData) => {
    const addedItem = {
      itemId: itemData._id,
      menuId: itemData.menuId,
      itemPriceName: itemData.price[0].name,
      itemName: itemData.itemName,
      addOnPrices: 0,
      itemPrice: itemData.price[0].price,
      totalPrice: itemData.price[0].price,
      totalQuantity: 1,
      modifiers: [],
    };

    storeItemsInCartandLocal(addedItem);
    toast.success(`${itemData.itemName} Successfully added to cart`);
  };

  // to show cart button or not depending on data from dashboard
  const isCartButtonVisible = (orderType, orderSettings) => {
    if (!orderType || !orderSettings) return false;

    switch (orderType) {
      case "table":
        return orderSettings?.settings?.dineIn?.orderEnabled;
      case "delivery":
        return orderSettings?.settings?.delivery?.orderEnabled;
      case "pickup":
        return orderSettings?.settings?.pickup?.orderEnabled;
      default:
        return false;
    }
  };

  // Function to map cart data to backend format
  const transformCartToOrder = (cart, tableName, customerInfo) => {
    const type = localStorage.getItem("orderType");
    const orderType = type === "delivery" ? "DELIVERY" : "DINEIN";

    const orderSummary = cart.map((item) => {
      return {
        itemName: item.itemName,
        itemSizeName: item.itemPriceName || "Regular", // Default to "Regular" if not provided
        itemPrice: item.itemPrice,
        quantity: item.totalQuantity,
        modifiers: item.modifiers.map((modifier) => ({
          modifierName: modifier.modifierItemName,
          modifierPrice: modifier.modifierPrice,
          quantity: modifier.quantity,
        })),
      };
    });

    return {
      orderType: orderType, // This would likely come from the front-end selection
      paymentMethod: "CASH", // This would come from the front-end selection
      orderSummary: orderSummary,
      customerInfo: customerInfo,
      tableName: tableName,
      appliedCharges
    };
  };

 


  const calculateDeliveryFee = (orderType,orderSettings) => {
    return orderType === "delivery" &&
      orderSettings?.settings?.delivery?.deliveryFee
      ? orderSettings.settings.delivery.deliveryFee
      : 0;
  };

  const calculateSubtotal = () => {
    return cartItems?.reduce((total, item) => total + item.totalPrice, 0) || 0;
  };

  const calculateAdditionalCharges = (subtotal,charges) => {
    let tax = 0;
    let serviceCharge = 0;

    if (charges) {
      charges.forEach((charge) => {
        if (
          charge.chargesType === "SERVICE" ||
          charge.chargesType === "TAXES"
        ) {
          if (charge.amountType === "PERCENT") {
            const amount = (subtotal * charge.amount) / 100;
            if (charge.chargesType === "TAXES") {
              tax += amount;
            } else {
              serviceCharge += amount;
            }
          } else {
            const amount = charge.amount;
            if (charge.chargesType === "TAXES") {
              tax += amount;
            } else {
              serviceCharge += amount;
            }
          }
        }
      });
    }

    // Update applied charges state
    setAppliedCharges((prev) => ({
      ...prev,
      tax,
      serviceCharge,
    }));

    return tax + serviceCharge;
  };

  const calculateDiscount = (subtotal,charges) => {
    let discount = 0;

    if (charges) {
      charges.forEach((charge) => {
        if (charge.chargesType === "DISCOUNT") {
          if (charge.amountType === "PERCENT") {
            discount += (subtotal * charge.amount) / 100;
          } else {
            discount += charge.amount;
          }
        }
      });
    }

    // Update applied charges state
    setAppliedCharges((prev) => ({
      ...prev,
      discount,
    }));

    return discount;
  };

  // Function to calculate the total cart value
  const calculateTotalCartValue = (charges,orderType,orderSettings) => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal,charges); // Calculate discount
    const delivery = calculateDeliveryFee(orderType,orderSettings);
    const additionalCharges = calculateAdditionalCharges(subtotal - discount,charges); // Apply additional charges after discount

    // Update applied charges map using spread operator to update specific fields
    setAppliedCharges((prevCharges) => ({
      ...prevCharges,
      delivery: delivery,
    }));

    return subtotal - discount + delivery + additionalCharges;
  };

  const createOrder = async (venue, tableName, customerInfo) => {
    try {
      const orderData = transformCartToOrder(
        cartItems,
        tableName,
        customerInfo
      );

      const url = `http://localhost:3000/order/createOrder/${venue}`;

      const response = await axios.post(url, orderData);

      if (response.status === 200) {
        setCartItems([]);
        localStorage.removeItem("cartItems");
        setAppliedCharges({
          tax: 0,
          serviceCharge: 0,
          discount: 0,
          delivery: 0,
        });
        toast.success("Order Created Successfully");

           // Replace the route
      const orderId = response.data.order._id; 
      navigate(`/${venueId}/menu/${menuId}/order-summary/${orderId}`, { replace: true });

      }
    } catch (e) {
      console.log("error creating order ", e);
    }
  };

  const getOrder = async (orderId) => {
    try {
    
      const url = `http://localhost:3000/order/${orderId}`;

      const response = await axios.get(url);

      if (response.status === 200) {
    
           // Replace the route
      const orderId = response.data.data;
      setOrderData(orderId); 

      }
    } catch (e) {
      console.log("error creating order ", e);
    }
  };

  // Update localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("item set in cart");
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        storeItemsInCartandLocal,
        calculateTotalCartPrice,
        addItemToCart,
        isCartButtonVisible,
        appliedCharges,
        setAppliedCharges,
        calculateTotalCartValue,
        calculateDeliveryFee,
        calculateSubtotal,
        createOrder,
        getOrder,
        orderData
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
