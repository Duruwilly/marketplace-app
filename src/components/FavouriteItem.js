import React from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
function FavouriteItem({ FavouriteItem, id, handleDelete }) {
  return (
    <tr key={id} className="border-t-2 border-gray-200">
      <td className="w-10 text-center border-t-2 border-gray-200">
        <button
          className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 hover:bg-red-500 ml-4"
          onClick={() =>
            handleDelete(
              FavouriteItem.id,
              FavouriteItem.name || FavouriteItem.model
            )
          }
        >
          <FaTrash className="cursor-pointer " />
        </button>
      </td>
      <td className="px-4 py-3 border-b-2 border-gray-200">
        <img
          src={FavouriteItem.imgUrls[0]}
          alt="productImage"
          className="w-8 h-8 object-cover"
        />
      </td>
      <td className="px-4 py-3 border-t-2 border-gray-200">
        {FavouriteItem.name || FavouriteItem.model}
      </td>
      <td className="px-4 py-3 border-t-2 border-gray-200">
        {FavouriteItem.institution}
      </td>
      <td className="px-4 py-3 text-lg text-gray-900 border-t-2 border-gray-200">
        <p>
          ₦
          {[FavouriteItem.price]
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
      </td>
      <td className="w-10 text-center border-t-2 border-gray-200">
        <Link
          to={`/institution/${FavouriteItem.institution}/${
            FavouriteItem.name || FavouriteItem.model
          }/${id}`}
        >
          <button className="flex text-white bg-primaryBackground border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded">
            Buy
          </button>
        </Link>
      </td>
    </tr>
  );
}

export default FavouriteItem;
