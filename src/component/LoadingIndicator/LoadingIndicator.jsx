import React from "react";
import { ClipLoader } from "react-spinners";

function LoadingIndicator({ loading }) {
  return (
    <div
      className={`${
        loading !== true ? "hidden" : ""
      }  fixed inset-0 h-screen w-[420px] bg-black bg-opacity-20 flex justify-center items-center flex-col`}
      style={{ zIndex: 1000000 }} // Direct numeric zIndex
    >
      <ClipLoader
        color="#36D7B7"
        loading={loading}
        size={60}
        cssOverride={{
          borderWidth: "4px",
        }}
      />
    </div>
  );
}

export default LoadingIndicator;
