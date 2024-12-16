import { useState, useEffect, createContext, useRef, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { MenuContext } from "./MenuContext.jsx";
import { apiurl } from "../constants/apiconst.js";
export const VenueContext = createContext();

export const VenueContextProvider = ({ children }) => {
  // get venueId from params
  const { venueId } = useParams();
  // using location to check in params
  const location = useLocation();

  //to store table data
  const [tableData, setTableData] = useState(null);
  // to store venue data
  const [venueData, setVenueData] = useState(null);
  // to store menus data
  const [menus, setMenus] = useState(null);
  // to store tax,discount charges
  const [charges, setCharges] = useState(null);

  // to select selected menu data
  const [selectedMenu, setSelectedMenu] = useState(null);
  // to set order settings
  const [orderSettings, setOrderSettings] = useState(null);

  const [orderType, setOrderType] = useState(null);

  //to fetch venue data
  const fetchVenueData = async () => {
    try {
      const response = await axios.get(
        `${apiurl}venue/qr/${venueId}`
      );
      if (response.status === 200) {
        setVenueData(response.data.venue);
        setMenus(response.data.menus);
        setCharges(response.data.venueCharges);
        await getOrderSettings(response.data.venue._id);
        console.log(response.data);

        localStorage.setItem("venue", venueId);
      }
    } catch (err) {
      console.error(
        "Error fetching venue data:",
        err.response?.data?.message || err
      );
    }
  };

  // get order settings for that venue
  const getOrderSettings = async (venueId) => {
    try {
      const url = `${apiurl}order/settings/${venueId}`;
      const response = await axios.get(url);

      if (response.status === 200) {
        setOrderSettings(response.data?.data || {});
        console.log("orders seting", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching order settings:", error);
    } finally {
    }
  };

  // to get data of selected menu
  const getSelectedMenuData = async (venueId, menuId) => {
    try {
      const response = await axios.get(
        `${apiurl}menu/qr/${venueId}/${menuId}`
      );

      // Handle the response after successfully creating a venue
      if (response.data) {
        setSelectedMenu(response.data.data);
      }
    } catch (err) {
      console.log("Error getting menu with no item:", err);
    }
  };

  // to fetch table data if there table id in parms
  const fetchTableData = async (tableId) => {
    try {
      const response = await axios.get(
        `${apiurl}table/${venueId}/table/${tableId}`
      );
      if (response.status === 200) {
        setTableData(response.data.data);
        console.log(response.data.data);
      } 
    } catch (err) {
      localStorage.removeItem("tableId");
      storeOrderTypeInLocal(null); // Remove the order type if table is not found

      console.error(
        "Error fetching table data:",
        err.response?.data?.message || err
      );
    }
  };

  // getting table id if it's in link params
  const tableIdFromParams = () => {
    const params = new URLSearchParams(location.search);
    const table = params.get("table");
    if (table) {
      storeTableIdInLocal(table);
    } else {
      // localStorage.removeItem("tableId")
    }
  };

  // then storing table id in local storage
  const storeTableIdInLocal = (tableId) => {
    localStorage.setItem("tableId", tableId);
    storeOrderTypeInLocal("table");
  };

  // to store order type in local
  const storeOrderTypeInLocal = (orderType) => {
    localStorage.setItem("orderType", orderType);
    setOrderType(orderType);
  };

  // getting table id from local if avialable
  const getTableIdFromLocal = () => {
    const tableId = localStorage.getItem("tableId");
    if (tableId) {
      fetchTableData(tableId);
    }
  };
  // getting table type from local if avialable
  const getOrderTypeFromLocal = () => {
    const orderType = localStorage.getItem("orderType");
    if (orderType) {
      setOrderType(orderType);
    }
  };

  useEffect(() => {
    console.log("run first");
    tableIdFromParams();
    getTableIdFromLocal();
    getOrderTypeFromLocal();
  }, []);

  useEffect(() => {
    console.log("run second");
    fetchVenueData();
  }, []);

  useEffect(() => {
    const venue = localStorage.getItem("venue");
    if (venue !== venueId) {
      // remove the old venue data and cart items
      localStorage.removeItem("venue");
      localStorage.removeItem("cartItems");
    }
  }, []);

  return (
    <VenueContext.Provider
      value={{
        fetchVenueData,
        venueData,
        setVenueData,
        menus,
        selectedMenu,
        setSelectedMenu,
        tableData,
        orderSettings,
        getSelectedMenuData,
        orderType,
        storeOrderTypeInLocal,
        charges,
      }}
    >
      {children}
    </VenueContext.Provider>
  );
};
