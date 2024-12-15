import { Outlet, useParams } from "react-router-dom";
import { VenueContextProvider } from "../../context/VenueContext.jsx";
import { MenuContextProvider } from "../../context/MenuContext";
import { CartContextProvider } from "../../context/CartContext.jsx";

function VenueLayout() {

  return (
    <div>
      <VenueContextProvider>
        <MenuContextProvider>
          <CartContextProvider>
          <div className="w-[420px] h-full shadow-md">
          <Outlet />
          </div>
          </CartContextProvider>
        </MenuContextProvider>
      </VenueContextProvider>
    </div>
  );
}

export default VenueLayout;
