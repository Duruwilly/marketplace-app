import React from "react";
import { HiSearch } from "react-icons/hi";

const SearchInput = ({ placeholder }) => {
  return (
    <div className="flex gap-5 w-full max-w- items-center shadow-2xl text-xl">
      <HiSearch className="absolute ml-3 text-gray-400" />
      <input
      required
        type="text"
        placeholder={placeholder}
        className="w-full max-w- py-3 pl-10 border-2 border-input-borde block shadow focus:outline-none"
      />
    </div>
  );
};

export default SearchInput;
