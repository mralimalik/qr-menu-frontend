import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VenueContext } from "../../context/VenueContext";
import SelectMenuDialog from "../../component/SelectMenuDialog/SelectMenuDialog.jsx";
import "./Home.css";
import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator.jsx";
const Home = () => {
  const {
    venueData,
    menus,
    setSelectedMenu,
    tableData,
    orderSettings,
    orderType,
    storeOrderTypeInLocal,
    loading
  } = useContext(VenueContext);

  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("use effect of home");
    localStorage.removeItem("orderType");
    localStorage.removeItem("tableId");
  }, []);

  const handleMenuDialogClose = () => {
    setIsMenuDialogOpen(false);
  };

  const handleMenuSelection = (orderType) => {
    if (menus.length === 1) {
      setSelectedMenu(menus[0]);
      navigateToMenu(menus[0]);
      storeOrderTypeInLocal(orderType);
    } else if (menus.length > 1) {
      setIsMenuDialogOpen(true);
      storeOrderTypeInLocal(orderType);
    }
  };

  const navigateToMenu = (menu) => {
    if (menu) {
      navigate(`/${venueData.venueId}/menu/${menu._id}`);
      // localStorage.setItem("menu",menu._id);
    } else {
      console.log("No selected menu");
    }
  };

  const shouldShowDeliveryButton =
    orderSettings?.settings?.delivery?.orderEnabled;
  const orderStatusNavigation = () => {
    navigate(`/${venueData.venueId}/order-status`);
  };

  return (
    <div className="h-screen w-full flex flex-col relative">
      <div className="bg-violet-400 text-white text-base py-2 px-4 flex justify-end">
        <button className="login-button">Login</button>
      </div>
      {tableData && (
        <div className="flex justify-center my-4 font-medium">
          {tableData.tableName}
        </div>
      )}
      <div className="h-full flex flex-col justify-center gap-20 px-2">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-medium my-4">
            {venueData ? venueData.venueName : ""}
          </h1>

          {orderType === "table" && (
            <MenuButton
              buttonText={
                menus && menus.length === 0 ? "Menu is not ready" : "Go to Menu"
              }
              handleMenu={() => handleMenuSelection("table")}
            />
          )}

          {orderType !== "table" && (
            <>
              {/* {shouldShowDeliveryButton && (
                <MenuButton buttonText="Delivery" handleMenu={()=>handleMenuSelection("delivery")} />
              )}
              {shouldShowPickupButton && (
                <MenuButton buttonText="Pick up" handleMenu={()=>handleMenuSelection("pickup")}/>
              )} */}

              <MenuButton
                buttonText={
                  menus && menus.length === 0
                    ? "Menu is not ready"
                    : "Go to Menu"
                }
                handleMenu={() => handleMenuSelection(null)}
              />
            </>
          )}
        </div>
        <div
          className="border-y-2 py-4 px-2 cursor-pointer"
          onClick={orderStatusNavigation}
        >
          <p>📄 Order Status</p>
        </div>
      </div>
      {isMenuDialogOpen && (
        <SelectMenuDialog menus={menus} onClose={handleMenuDialogClose} />
      )}
      <LoadingIndicator loading={loading}/>
    </div>
  );
};

export default Home;

export const MenuButton = ({ handleMenu, buttonText = "Go to Menu" }) => {
  return (
    <button
      className="text-md bg-violet-400 py-2 text-white w-80 rounded-md cursor-pointer"
      onClick={handleMenu}
    >
      {buttonText}
    </button>
  );
};
