import React from "react";

const Spinner = ({ message }) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full pt-6">
            <span id="loader"></span>
            <p className="text-lg text-center px-2">{message}</p>
        </div>
    );
};

export default Spinner;
