import React from "react";
import { RenderPriceInUSD } from "../utils/RenderPriceInUSD";
import { Link } from "react-router-dom";
import { valideURLConvert } from "../utils/valideURLConvert";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`;
  const [loading, setLoading] = useState(false);

  return (
    <Link
      to={url}
      className="group border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded-lg shadow-sm hover:shadow-lg hover:border-primary-100 transition-all duration-300 bg-white"
    >
      <div className="relative min-h-20 w-full max-h-24 lg:max-h-32 rounded-md overflow-hidden bg-gray-50">
        <img
          src={data.image[0]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          alt={data.name}
        />
        {Boolean(data.discount) && (
          <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
            -{data.discount}%
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 rounded text-xs px-2 py-0.5 text-green-600 bg-green-50">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          10 min
        </div>
      </div>
      <div className="px-2 lg:px-0 font-medium text-gray-800 text-sm lg:text-base line-clamp-2 group-hover:text-primary-600 transition-colors">
        {data.name}
      </div>
      <div className="w-fit px-2 lg:px-0 text-sm lg:text-base text-gray-500">
        {data.unit}
      </div>

      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base mt-auto">
        <div className="flex flex-col">
          <div className="font-semibold text-gray-900">
            {RenderPriceInUSD(pricewithDiscount(data.price, data.discount))}
          </div>
          {Boolean(data.discount) && (
            <div className="text-xs text-gray-500 line-through">
              {RenderPriceInUSD(data.price)}
            </div>
          )}
        </div>
        <div>
          {data.stock == 0 ? (
            <div className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded">
              Out of stock
            </div>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
