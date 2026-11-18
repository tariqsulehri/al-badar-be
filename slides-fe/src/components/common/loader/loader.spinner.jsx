import React from "react";

const LoaderSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
    </div>
  );
};

export default LoaderSpinner;
