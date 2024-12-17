import React from "react";
import { VenueContext } from "../../context/VenueContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
const SelectMenuDialog = ({ menus, onClose }) => {
  const { venueData, setSelectedMenu, } = useContext(VenueContext);

  const navigate = useNavigate();
  const handleMenuTap = (menu) => {
    setSelectedMenu(menu);
    if (menu) {
      navigate(`/${venueData.venueId}/menu/${menu._id}`);
      // localStorage.setItem("menu",menu._id);

    } else {
      console.log("No selected menu");
    }
  };

  return (
    <div className="w-full h-full bg-black bg-opacity-40 absolute top-0 left-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96 max-h-[80vh] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Select a Menu</h3>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800 focus:outline-none cursor-pointer">
            &times;
          </button>
        </div>
        {menus && menus.length > 0 ? (
          <div>
            {menus.map((menu, index) => (
              <div key={index} className="py-2 flex justify-between cursor-pointer" onClick={() => handleMenuTap(menu)}>
                <h5 className="font-medium text-lg">{menu.menuName}</h5>
                <p>{">"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No menus available</p>
        )}
      </div>
    </div>
  );
};

export default SelectMenuDialog;
