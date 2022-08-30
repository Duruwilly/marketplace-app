import React from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
function FavouriteItem({ FavouriteItem, id, handleDelete }) {
  return (
    <tr key={id} className="border-t-2 border-gray-200">
      <td className="w-10 text-center border-t-2 border-gray-200">
        <span className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4 hover:bg-red-200">
          {/* <FaTrash
            className="cursor-pointer"
            onClick={() => handleDelete(id)}
          /> */}
        </span>
      </td>
      <td className="px-4 py-3 border-b-2 border-gray-200">
        <img src={FavouriteItem.imgUrls[0]} alt="productImage" className="w-8 h-8" />
      </td>
      <td className="px-4 py-3 border-t-2 border-gray-200">{FavouriteItem.name}</td>
      <td className="px-4 py-3 border-t-2 border-gray-200">1</td>
      <td className="px-4 py-3 text-lg text-gray-900 border-t-2 border-gray-200">
        <p>
          ₦{[FavouriteItem.price].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
      </td>
      <td className="w-10 text-center border-t-2 border-gray-200">
        {" "}
        {FavouriteItem.mobileNumber && (
          <a
            href={`https://wa.me/+234${FavouriteItem.mobileNumber.substring(
              1
            )}?text=%7B0%7D+I would love to Purchase your ${
              FavouriteItem.name
            } on Sellit at (https://sell-it-lit.vercel.app/category/${
              FavouriteItem.brand
            }/${id}.)`}
            rel="norefferer"
          >
            <button className="flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
              Buy
            </button>
          </a>
        )}
      </td>
    </tr>
  );
}

export default FavouriteItem;
