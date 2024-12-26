import React, { useContext } from "react";
import "./MenuItemBox.css";
import { VenueContext } from "../../context/VenueContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../../context/CartContext.jsx";
const MenuItemBox = ({ item }) => {
  const { orderSettings, tableData, orderType,selectedMenu } = useContext(VenueContext);
  const { venueId, menuId } = useParams(); // Get the venueId from the route parameters
  const { calculateTotalCartPrice, addItemToCart, isCartButtonVisible } =
    useContext(CartContext);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${venueId}/menu/${menuId}/item/${item._id}`);
  };
console.log(item);

  return (
    <div>
      <div
        className="menu-item-box bg-white  shadow-md rounded-lg px-4 py-4 my-4 flex justify-between cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-medium">{item ? item.itemName : ""}</h4>
          <h3>Spinach, romain lettuce</h3>
          <h2 className="text-red-400">${item ? item.price[0].price : ""}</h2>
        </div>
        <div className="flex flex-col gap-2 items-end ">
          <div className="bg-red-400 h-[90px] w-[100px] rounded-xl object-cover flex justify-center flex-col">
            {item?.image ? (
              <img
                src={item.image}
                alt="Item image"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <p className="text-white text-center">No Image</p> // Fallback text if no image is available
            )}
          </div>
          {isCartButtonVisible(orderType, orderSettings, selectedMenu.orderSettings) && (
            <div
              className="bg-violet-500 px-2 rounded-md flex justify-center items-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the parent div's onClick from firing

                addItemToCart(item);
              }}
            >
              <h3 className="text-white text-lg">+</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemBox;
