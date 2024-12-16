import React, { useEffect } from "react";
import MenuItemBox from "../../component/MenuItemBox/MenuItemBox";
import "./MenuHome.css";
import { VenueContext } from "../../context/VenueContext.jsx";
import { useContext } from "react";
import { MenuContext } from "../../context/MenuContext.jsx";
import { useParams } from "react-router-dom";
import MenuSectionBox from "../../component/MenuSectionBox/MenuSectionBox.jsx";
import { CartContext } from "../../context/CartContext.jsx";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
const MenuHome = () => {
  const {
    venueData,
    menus,
    setSelectedMenu,
    selectedMenu,
    tableData,
    getSelectedMenuData,
    orderType,
    orderSettings,
  } = useContext(VenueContext);
  const { calculateTotalCartPrice ,addItemToCart ,isCartButtonVisible} = useContext(CartContext);

  const { getMenuesItemsandSections, setMenuItemsData, menuItemsData } =  useContext(MenuContext);
  const { venueId, menuId } = useParams();
  const navigate = useNavigate();

  const menu = [
    "Starter",
    "Salad",
    "Starter",
    "Salad",
    "Starter",
    "Salad",
    "Starter",
    "Salad",
  ];
  useEffect(() => {
    console.log(menuId);
    getSelectedMenuData(venueId, menuId);
    getMenuesItemsandSections(menuId);
  }, []);

  const handleViewCartClick = () => {
    navigate(`/${venueId}/menu/${menuId}/cart`); // Navigate to the item detail page
  };

  return (
    <div>
      <div className="mb-20">
        <div className="bg-violet-400 p-3 text-xl text-white font-semibold flex justify-center  ">
          <h4>{venueData ? venueData.venueName : ""} Menu</h4>
        </div>
        {tableData && (
          <div className="flex justify-center py-4 font-medium border-b">
            {tableData.tableName}
          </div>
        )}
        <div className="mt-10 px-3">
          <h3 className="font-semibold text-2xl flex justify-center">
            {selectedMenu ? selectedMenu.menuName : ""}
          </h3>
          <div className="w-full my-5">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-3 px-4 border rounded-full "
            />
          </div>

          <div className="scrollable-menu flex gap-5 w-ful overflow-x-auto">
            {menuItemsData.map((parentMenu, index) => {
              if (parentMenu.type === "SECTION") {
                return (
                  <div key={index} className="flex flex-col w-fit">
                    <div className="h-20 w-28">
                      <img
                        src="https://media.finedinemenu.com/filters:strip_exif()/filters:format(webp)/1334x444/EkQEL4rnl/64b5aa6d-8894-4d19-8a1a-a55ae5eaae6f.jpg"
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <h3 className="text-lg font-mono text-center">
                      {parentMenu.sectionName}
                    </h3>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {menuItemsData.map((parentMenu, parentIndex) => {
            if (parentMenu.type === "SECTION") {
              return <MenuSectionBox key={parentIndex} section={parentMenu} />;
            } else {
              return <MenuItemBox key={parentIndex} item={parentMenu} />;
            }
          })}
        </div>
      </div>
      {isCartButtonVisible(orderType, orderSettings) && (
        <div className="p-3 bg-white fixed bottom-0 w-full">
          <div className="bg-violet-400 py-[8px] text-white flex justify-center items-center font-medium  text-lg cursor-pointer w-[390px]" onClick={handleViewCartClick}>
            <h4>View Cart ${calculateTotalCartPrice()}</h4>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default MenuHome;
