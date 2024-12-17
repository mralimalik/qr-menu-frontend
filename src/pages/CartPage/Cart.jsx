import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { VenueContext } from "../../context/VenueContext";
import { useNavigate,useParams } from "react-router-dom";
const Cart = () => {
  const navigate = useNavigate();
  const {venueId,menuId} = useParams();
  const {
    cartItems,
    setCartItems,
    isCartButtonVisible,
    appliedCharges,
    setAppliedCharges,
  } = useContext(CartContext);

  

  const { charges, orderSettings, orderType, tableData } =
    useContext(VenueContext);


  // to set total cart value
  const [totalCartValue, setTotalCartValue] = useState(0);

  // to show delivery fee
  const [deliveryFee, setDeliveryFee] = useState(0);

  // const handleQuantityChange = (index, action) => {
  //   // Update the cartItems state based on the action (increase or decrease)
  //   setCartItems((prevItems) => {
  //     const updatedItems = [...prevItems]; // Create a copy of the array
  //     const item = updatedItems[index]; // Get the item at the given index

  //     let updatedQuantity = item.totalQuantity;
  //     if (action === "increase") {
  //       updatedQuantity += 1;
  //     } else if (action === "decrease") {
  //       // Prevent decreasing if the quantity is already 1
  //       if (updatedQuantity > 1) {
  //         updatedQuantity -= 1;
  //       } else {
  //         console.log("Quantity cannot be less than 1");
  //         return updatedItems; // No changes if the condition is not met
  //       }
  //     }

  //     // Update the total price of the item based on the new quantity
  //     const updatedTotalPrice =
  //       updatedQuantity * (item.itemPrice + item.addOnPrices);

  //     updatedItems[index] = {
  //       // Modify the item at the index
  //       ...item,
  //       totalQuantity: updatedQuantity,
  //       totalPrice: updatedTotalPrice, // Update totalPrice here
  //     };

  //     return updatedItems; // Return the updated cartItems
  //   });
  // };
  const handleQuantityChange = (index, action) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      const item = updatedItems[index];

      if (action === "increase") {
        item.totalQuantity += 1;
      } else if (action === "decrease" && item.totalQuantity > 1) {
        item.totalQuantity -= 1;
      } else {
        console.log("Quantity cannot be less than 1");
        return updatedItems;
      }

      item.totalPrice =
        item.totalQuantity * (item.itemPrice + item.addOnPrices);
      return updatedItems;
    });
  };

  const handleDeleteItem = (itemIndexToDelete) => {
    setCartItems((currentCartItems) =>
      currentCartItems.filter(
        (cartItem, currentIndex) => currentIndex !== itemIndexToDelete
      )
    );
  };

  const calculateDeliveryFee = () => {
    return orderType === "delivery" &&
      orderSettings?.settings?.delivery?.deliveryFee
      ? orderSettings.settings.delivery.deliveryFee
      : 0;
  };

  const calculateSubtotal = () => {
    return cartItems?.reduce((total, item) => total + item.totalPrice, 0) || 0;
  };

  // // Function to calculate additional charges like taxes, service
  // const calculateAdditionalCharges = (subtotal) => {
  //   if (!charges) return 0;

  //   return charges.reduce((total, charge) => {
  //     if (charge.chargesType === "SERVICE" || charge.chargesType === "TAXES") {
  //       if (charge.amountType === "PERCENT") {
  //         return total + (subtotal * charge.amount) / 100;
  //       } else {
  //         return total + charge.amount;
  //       }
  //     }
  //     return total; // Ignore discounts
  //   }, 0);
  // };

  // // calculate discount
  // const calculateDiscount = (subtotal) => {
  //   if (!charges) return 0;

  //   return charges.reduce((totalDiscount, charge) => {
  //     if (charge.chargesType === "DISCOUNT") {
  //       // Calculate discount based on type
  //       if (charge.amountType === "PERCENT") {
  //         return totalDiscount + (subtotal * charge.amount) / 100;
  //       } else {
  //         return totalDiscount + charge.amount;
  //       }
  //     }
  //     return totalDiscount; // Ignore other charge types
  //   }, 0);
  // };

  const calculateAdditionalCharges = (subtotal) => {
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

  const calculateDiscount = (subtotal) => {
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
  const calculateTotalCartValue = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal); // Calculate discount
    const delivery = calculateDeliveryFee();
    const additionalCharges = calculateAdditionalCharges(subtotal - discount); // Apply additional charges after discount

    // Update applied charges map using spread operator to update specific fields
    setAppliedCharges((prevCharges) => ({
      ...prevCharges,
      delivery: delivery,
    }));

    return subtotal - discount + delivery + additionalCharges;
  };

  useEffect(() => {
    setDeliveryFee(calculateDeliveryFee());
  }, [orderSettings, orderType]);

  useEffect(() => {
    if (cartItems?.length > 0) {
      setTotalCartValue(calculateTotalCartValue());
      console.log("Cart items", cartItems);
    } else {
      setTotalCartValue(0);
    }
  }, [cartItems, deliveryFee, charges, orderType]);

  const handleCheckout = () => {
    if (cartItems && cartItems.length > 0 && venueId && menuId) {
      navigate(`/${venueId}/menu/${menuId}/checkout`);
    } else {
      console.log("Cart is empty or missing venueId/menuId");
    }
  };
  

  return (
    <div className="bg-slate-100">
      <div className="pb-20 overflow-y-auto">
        <header className="flex justify-center items-center  bg-violet-400 py-2 text-white px-4 w-full">
          {/* <button>&larr;</button> */}
          <h1 className="text-xl font-bold">Your Cart</h1>
        </header>

        <div className="m-4 px-4 bg-white shadow-md rounded-lg py-3 flex justify-between items-center">
          {orderType === "delivery" && (
            <>
              <p>
                Delivery: <span className="font-semibold">QWERTY</span>
              </p>
              <button className="font-medium text-violet-500">Change</button>
            </>
          )}
          {orderType === "pickup" && (
            <>
              <p>Pickup</p>
            </>
          )}
          {orderType === "table" && (
            <>
              <p>
                Order:{" "}
                <span className="font-semibold">{tableData?.tableName}</span>
              </p>
            </>
          )}
        </div>

        {/* cart item list */}
        <div className="p-4 bg-white shadow-md rounded-lg m-4">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className=" px-4 py-4 mb-4 flex justify-between items-center border-b"
            >
              <div>
                <h2 className="text-lg font-medium">{item.itemName}</h2>
                <p className="text-purple-500">${item.totalPrice}</p>
              </div>

              <div className="flex items-center gap-2">
                {/* delete icon */}
                {item.totalQuantity === 1 && (
                  <button
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteItem(index)}
                  >
                    &#128465;
                  </button>
                )}

                {/* increment icon */}
                <div className="flex items-center gap-2">
                  {item.totalQuantity > 0 && (
                    <button
                      className="bg-purple-500 text-white px-2 rounded cursor-pointer"
                      onClick={() => handleQuantityChange(index, "decrease")}
                    >
                      -
                    </button>
                  )}
                  <span className="text-xl">{item.totalQuantity}</span>
                  <button
                    className="bg-purple-500 text-white px-2 rounded cursor-pointer"
                    onClick={() => handleQuantityChange(index, "increase")}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* total price div */}
        <div className="p-4 bg-white m-4 rounded-lg shadow-md flex flex-col gap-3">
          <div className="flex justify-between ">
            <p>Items</p>
            <p>${calculateSubtotal().toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>${calculateSubtotal().toFixed(2)}</p>
          </div>
          {/* only show fees if there are items */}
          {cartItems?.length > 0 && (
            <>
              {orderType === "delivery" && (
                <div className="flex justify-between">
                  <p>Delivery Fee</p>
                  <p>${deliveryFee}</p>
                </div>
              )}

              {charges?.map((data, index) => (
                <div className="flex justify-between" key={index}>
                  <p>{data.name}</p>
                  <p>
                    {data.amountType === "PERCENT" ? "%" : "$"}
                    {data.amount}
                  </p>
                </div>
              ))}
            </>
          )}
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>${totalCartValue.toFixed(2)}</p>
          </div>
        </div>
      </div>
      {isCartButtonVisible(orderType, orderSettings) && (
        <div className="px-2 py-2 bg-white fixed bottom-0 w-full cursor-pointer" onClick={handleCheckout}>
          <button className={`${cartItems?.length===0?"bg-purple-200":"bg-purple-500"} text-white w-[400px] py-2 rounded-lg font-semibold`}>
            Checkout (${totalCartValue.toFixed(2)})
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
