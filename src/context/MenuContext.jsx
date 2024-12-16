import { useState, useEffect, createContext, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { VenueContext } from "./VenueContext";
import axios from "axios";
import { apiurl } from "../constants/apiconst.js";
export const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
  // const { venueData,setSelectedMenu } = useContext(VenueContext);
  const {menuId} = useParams();

  // const fetchMenuData = async () => {
  //   try {
  //     console.log("params");

  //     const response = await axios.get(`http://localhost:3000/menu/qr/${venueId}/${menuId}`);
  //     if (response.status === 200) {
  //    setSelectedMenu(response.data.data);
  //     }else{
  //       console.log('no respone');

  //     }
  //   } catch (err) {
  //     console.error("Error fetching menu data:", err.response?.data?.message || err);
  //   }
  // };

  // useEffect(() => {
  //   // if(!setSelectedMenu){
  //     fetchMenuData();
  //   // }
  // }, []);
  const [menuItemsData, setMenuItemsData] = useState([]);
  const getMenuesItemsandSections = async (menuId) => {
    try {
      const response = await axios.get(`${apiurl}menu/qr/${menuId}`);

      // Handle the response after successfully creating a venue
      if (response.data) {
        console.log("Data of items and secitons", response.data);
        setMenuItemsData(response.data);
      }else{
        setMenuItemsData([]);
      }
    } catch (err) {
      console.log("Error getting menu with no item:", err);
    }
  };


 
  



  return (
    <MenuContext.Provider value={{ menuItemsData, setMenuItemsData, getMenuesItemsandSections }}>
      {children}
    </MenuContext.Provider>
  );
};
