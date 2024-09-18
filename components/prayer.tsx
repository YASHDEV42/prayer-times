import React from "react";

const Prayer = ({ name, time }) => {
  return (
    <div className="flex items-center justify-center flex-col">
      <span className=" text-2xl">{name}</span>
      <span className=" text-xl">{time}</span>
    </div>
  );
};

export default Prayer;
