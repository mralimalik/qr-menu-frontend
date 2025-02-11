import { useEffect, useState } from "react";
import "./ItemDetail.css";
import { VenueContext } from "../../context/VenueContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import { apiurl } from "../../constants/apiconst.js";
import "react-toastify/dist/ReactToastify.css";
import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator.jsx";

const ItemDetail = ({}) => {
  const { itemId } = useParams();

  const { orderSettings, tableData, orderType, selectedMenu } =
    useContext(VenueContext);
  const { storeItemsInCartandLocal, isCartButtonVisible } =
    useContext(CartContext);

  const [loading, setLoading] = useState(false);
  // to store current item data
  const [itemData, setItemData] = useState(null);
  // to store item modifier
  const [modifiers, setModifiers] = useState(null);

  // to set total item price (with modifiers)
  const [totalItemPrice, setTotalItemPrice] = useState(0);
  // to set defualt item price
  const [selectedPrice, setSelectedPrice] = useState(0);
  //to set selected price index
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  // to set  item quantity
  const [quantity, setQuantity] = useState(0);
  //to set modifier and their quantity
  const [modifierQuantity, setModifierQuantity] = useState([]);

  // to show cart button or not depending on data from dashboard
  // const isCartButtonVisible = () => {
  //   if (!orderType || !orderSettings) return false; // Do not show if orderType is null or orderSettings is missing

  //   switch (orderType) {
  //     case "table":
  //       return orderSettings?.settings?.dineIn?.orderEnabled;
  //     case "delivery":
  //       return orderSettings?.settings?.delivery?.orderEnabled;
  //     case "pickup":
  //       return orderSettings?.settings?.pickup?.orderEnabled;
  //     default:
  //       return false;
  //   }
  // };

  // to fetch item data and their modifiers using itemId
  const fetchModifiers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiurl}modifier/${itemId}`);

      // Only set modifiers if status code is 200
      if (response.status === 200) {
        setModifiers(response.data.item.modifiers);
        setItemData(response.data.item);
        console.log(response.data);
      }
    } catch (error) {
      // Optionally log the error or display a generic message
      console.error("Error fetching modifiers:", error);
    } finally {
      setLoading(false);
    }
  };

  // handle item quantity increment
  const handleAddCartItemQuantity = () => {
    setQuantity((prev) => prev + 1); // Increment quantity
  };

  // handle item quantity decrement
  const handleDecreaseCartItemQuantity = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0)); // Decrement, but prevent going below 0
  };

  // handle adding item modifiers
  const addModifiers = (
    modifierGroupId,
    modifierPriceId,
    price,
    min,
    max,
    isIncrementing,
    modifierGroupName,
    modifierItemName
  ) => {
    setModifierQuantity((prev) => {
      // Calculate the total quantity for the current modifier group
      const totalGroupQuantity = prev
        .filter((item) => item.modifierId === modifierGroupId)
        .reduce((sum, item) => sum + item.quantity, 0);

      // Find the existing modifier by modifierPriceId
      const existingModifierIndex = prev.findIndex(
        (item) => item.modifierPriceId === modifierPriceId
      );

      if (existingModifierIndex !== -1) {
        // If the modifier already exists, update its quantity and totalPrice
        const updatedModifiers = [...prev];
        const existingModifier = updatedModifiers[existingModifierIndex];

        const newQuantity = isIncrementing
          ? existingModifier.quantity + 1
          : existingModifier.quantity - 1;

        // Ensure the total quantity doesn't exceed the max value
        if (isIncrementing && totalGroupQuantity >= max) {
          toast.error(`You can add a maximum of ${max} items to this group.`);
          return prev; // Return unchanged if max is reached
        }

        // Remove the item if its quantity becomes 0
        if (newQuantity === 0) {
          return prev.filter(
            (item) => item.modifierPriceId !== modifierPriceId
          );
        }

        // Update the existing modifier
        updatedModifiers[existingModifierIndex] = {
          ...existingModifier,
          quantity: newQuantity,
          totalPrice: newQuantity * price,
          modifierName: modifierGroupName,
          modifierItemName: modifierItemName,
          modifierPrice: price,
        };

        return updatedModifiers;
      } else {
        // If the modifier doesn't exist and is incrementing, add a new one
        if (isIncrementing) {
          // Ensure the total quantity doesn't exceed the max value
          if (totalGroupQuantity >= max) {
            toast.error(`You can add a maximum of ${max} items to this group.`);

            console.log("Cannot exceed max limit for this modifier group");
            return prev; // Return unchanged if max is reached
          }

          return [
            ...prev,
            {
              modifierId: modifierGroupId,
              modifierPriceId: modifierPriceId,
              quantity: 1,
              totalPrice: price,
              modifierItemName: modifierItemName,
              modifierGroupName: modifierGroupName,
              modifierPrice: price,
            },
          ];
        }
      }

      return prev; // Return unchanged if decrementing and item doesn't exist
    });

    console.log(modifierQuantity);
  };

  // to check checkbox prices
  const handlePriceSelection = (price, index) => {
    setSelectedPrice(price);
    setSelectedPriceIndex(index); // Set the selected price index
  };

  // to caluculate total price
  const calculateTotalItemPrice = () => {
    if (quantity > 0) {
      // get the item price
      let total = selectedPrice;

      // get and add all the modifier total prices if there is any;
      modifierQuantity.forEach((modifier) => {
        total += modifier.totalPrice;
      });

      // then multiply by quantity of item
      let totalPrice = total * quantity;
      setTotalItemPrice(totalPrice);
    } else {
      setTotalItemPrice(0);
    }
  };

  // to handle add to cart
  const handleAddToCart = () => {
    if (quantity > 0) {
      let total = 0;
      // get and add all the modifier total prices if there is any;
      modifierQuantity.forEach((modifier) => {
        total += modifier.totalPrice;
      });

      const addedItem = {
        sectionId: itemData.parentId,
        itemId: itemData._id,
        menuId: itemData.menuId,
        itemName: itemData.itemName,
        itemPriceName: itemData.price[selectedPriceIndex].name,
        totalQuantity: quantity,
        modifiers: modifierQuantity,
        totalPrice: totalItemPrice,
        itemPrice: selectedPrice,
        addOnPrices: total,
      };
      storeItemsInCartandLocal(addedItem);
      toast.success(`Successfully added to cart`);
    } else {
      toast.error(`Quantity can't be zero `);
    }
  };

  useEffect(() => {
    fetchModifiers();
  }, []);

  // setting default price value
  useEffect(() => {
    if (itemData) {
      setSelectedPrice(itemData.price[0].price);
    }
  }, [itemData]);

  // calculating total item value based on these
  useEffect(() => {
    calculateTotalItemPrice();
  }, [quantity, modifierQuantity, selectedPrice]);
  return (
    <div className="bg-white flex justify-start ">
      <div className="main-div h-screen   overflow-y-auto  relative overflow-hidden sm:w-[410px] w-full">
        {/* {image div} */}
        <div className="sm:w-[410px] w-full object-cover h-[300px] bg-slate-400 fixed">
          {/* Check if itemData.image exists, and render the image */}
          {itemData?.image ? (
            <img
              src={itemData.image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="flex justify-center items-center h-[180px]">
              No image available
            </p>
          )}
        </div>
        {/* {bottom sheet div} */}
        <div
          className="bottom-sheet-div border-r h-full w-full bg-white rounded-t-[30px] 
        rounded-tr-[30px] absolute z-50 -bottom-48 px-4 py-4 flex flex-col gap-3 overflow-y-auto"
        >
          <h3 className="font-medium text-xl text-slate-600">
            {itemData?.itemName}
          </h3>

          <h3
            className="font-normal text-base text-slate-600"
            dangerouslySetInnerHTML={{ __html: itemData?.description }}
          />

          {/* different item prices  based on their sizes or servings*/}
          {itemData?.price.map((price, index) => {
            return (
              <div key={index} className="flex justify-between">
                <h3 className="font-medium text-base text-red-500">
                  $ {price.price}
                </h3>
                {itemData.price.length > 1 && (
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    name="priceselect"
                    id="priceselect"
                    checked={selectedPriceIndex === index}
                    onChange={() => handlePriceSelection(price.price, index)}
                  />
                )}
              </div>
            );
          })}

          {/* {Item modifier list to add aditional item in item} */}
          {modifiers && modifiers.length > 0 && (
            <div className="mt-3 mb-8">
              {modifiers?.map((modifierGroup, index) => {
                return (
                  <div key={index}>
                    {/* {Modifer group} */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <h3 className="font-medium text-lg text-slate-600">
                          {modifierGroup.groupName}
                        </h3>
                        <h3 className="font-normal text-md text-slate-400">
                          (Max {modifierGroup.max})
                        </h3>
                      </div>
                      <div className="flex justify-center items-center px-3  py-1 bg-gray-500 rounded-full ">
                        <p className="text-xs text-white ">Optional</p>
                      </div>
                    </div>

                    {/* {Modifer items} */}
                    {modifierGroup?.modifierPrices?.map((price, index) => {
                      const modifierItem = modifierQuantity.find(
                        (item) =>
                          item.modifierPriceId === price._id &&
                          item.modifierId === modifierGroup.modifierId
                      );
                      const modifierQuantityValue = modifierItem
                        ? modifierItem.quantity
                        : 0;

                      return (
                        <div key={index}>
                          <div className="flex justify-between items-center my-2">
                            <div>
                              <h3 className="font-normal text-base text-slate-600">
                                {price.name} ({price.calories} Cal)
                              </h3>
                              <h3 className="font-medium text-base text-red-500">
                                $ {price.price}
                              </h3>
                            </div>

                            <div className="flex gap-2 items-center justify-center">
                              <div
                                className="border border-red-400 h-7 w-7 rounded-full  flex justify-center items-center cursor-pointer"
                                onClick={() => {
                                  addModifiers(
                                    modifierGroup.modifierId,
                                    price._id,
                                    price.price,
                                    modifierGroup.min,
                                    modifierGroup.max,
                                    false,
                                    modifierGroup.groupName,
                                    price.name
                                  );
                                }}
                              >
                                <p>-</p>
                              </div>

                              <p className="text-xl">{modifierQuantityValue}</p>

                              <div
                                className="border border-red-400 h-7 w-7 rounded-full  flex justify-center items-center cursor-pointer"
                                onClick={() => {
                                  addModifiers(
                                    modifierGroup.modifierId,
                                    price._id,
                                    price.price,
                                    modifierGroup.min,
                                    modifierGroup.max,
                                    true,
                                    modifierGroup.groupName,
                                    price.name
                                  );
                                }}
                              >
                                <p>+</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* add to cart button */}
          {isCartButtonVisible(
            orderType,
            orderSettings,
            selectedMenu?.orderSettings
          ) && (
            <div className="fixed bottom-0 py-2  sm:w-[410px] w-full left-0 px-3 bg-white ">
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2 items-center justify-center">
                  <div
                    className="border border-red-400 h-7 w-7 rounded-full  flex justify-center items-center cursor-pointer"
                    onClick={handleDecreaseCartItemQuantity}
                  >
                    <p>-</p>
                  </div>

                  <p className="text-xl">{quantity}</p>

                  <div
                    className="border border-red-400 h-7 w-7 rounded-full  flex justify-center items-center cursor-pointer"
                    onClick={handleAddCartItemQuantity}
                  >
                    <p>+</p>
                  </div>
                </div>
                <button
                  className="w-56 bg-violet-400 py-2 text-white rounded-md cursor-pointer"
                  onClick={handleAddToCart}
                >
                  Add To Cart {`$${totalItemPrice}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <ToastContainer />
      </div>
      <LoadingIndicator loading={loading} />
    </div>
  );
};

export default ItemDetail;
