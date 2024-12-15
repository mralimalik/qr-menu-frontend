import React from "react";
import MenuItemBox from "../MenuItemBox/MenuItemBox";
const MenuSubSection = ({ subsection }) => {
  return (
    <div>
      <h3 className="flex py-2 border rounded-md px-4">Subsection</h3>
      {/* <MenuItemBox/> */}
      
      {subsection.subSections.map((data, subIndex) => (
        <MenuSubSection key={subIndex} subsection={data} />
      ))}
    </div>
  );
};

export default MenuSubSection;
