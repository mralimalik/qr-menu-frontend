import React from "react";
import MenuItemBox from "../MenuItemBox/MenuItemBox.jsx";
import MenuSubSection from "../MenuSubSectionBox/MenuSubSection.jsx";

const MenuSectionBox = ({ section }) => {
  return (
    <div className="px-3 py-3 border rounded-md my-3">
      <div className="w-full h-24 bg-red-300 rounded-md ">
        <img
          src="https://media.finedinemenu.com/filters:strip_exif()/filters:format(webp)/1334x444/EkQEL4rnl/64b5aa6d-8894-4d19-8a1a-a55ae5eaae6f.jpg"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex justify-center text-xl font-medium my-2">
        <h3>{section.sectionName}</h3>
      </div>

      {/* Render item of non-parent top-level section */}
      {section.items && section.items.length > 0 && (
        <div>
          {section.items.map((data, itemIndex) => (
            <MenuItemBox key={itemIndex} item={data} />
          ))}
        </div>
      )}

      {/* {section.subSections && section.subSections.length > 0 && (
        <div>
          {section.subSections.map((data, subIndex) => (
            <MenuSubSection key={subIndex} subsection={data} />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default MenuSectionBox;
