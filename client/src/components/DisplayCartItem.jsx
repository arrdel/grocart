import React from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { RenderPriceInUSD } from "../utils/RenderPriceInUSD";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import imageEmpty from "../assets/empty_cart.webp";
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout");
      if (close) {
        close();
      }
      return;
    }
    toast("Please Login");
  };
  return (
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white w-full max-w-md min-h-screen max-h-screen ml-auto animate-slide-left">
        <div className="flex items-center p-5 shadow-sm border-b gap-3 justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
          <Link to={"/"} className="lg:hidden">
            <IoClose className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
          </Link>
          <button onClick={close} className="hidden lg:block">
            <IoClose className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
          </button>
        </div>

        <div className="min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-gray-50 p-4 flex flex-col gap-4">
          {cartItem[0] ? (
            <>
              <div className="flex items-center justify-between px-6 py-3 bg-primary-50 text-primary-700 rounded-lg border border-primary-100">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium">Total Savings</p>
                </div>
                <p className="font-bold text-green-600">
                  {RenderPriceInUSD(notDiscountTotalPrice - totalPrice)}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 grid gap-2 overflow-auto">
                {cartItem[0] &&
                  cartItem.map((item, index) => {
                    return (
                      <div
                        key={item?._id + "cartItemDisplay"}
                        className="flex w-full gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-20 h-20 min-h-20 min-w-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                          <img
                            src={item?.productId?.image[0]}
                            className="w-full h-full object-contain"
                            alt={item?.productId?.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2">
                            {item?.productId?.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item?.productId?.unit}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <p className="font-bold text-primary-700">
                              {RenderPriceInUSD(
                                pricewithDiscount(
                                  item?.productId?.price,
                                  item?.productId?.discount
                                )
                              )}
                            </p>
                            {item?.productId?.discount > 0 && (
                              <p className="text-sm text-gray-400 line-through">
                                {RenderPriceInUSD(item?.productId?.price)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <AddToCartButton data={item?.productId} />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="bg-white p-4 ">
                <h3 className="font-semibold">Bill details</h3>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Subtotal</p>
                  <p className="flex items-center gap-2">
                    <span className="line-through text-red-400">
                      {RenderPriceInUSD(notDiscountTotalPrice)}
                    </span>
                    <span className="text-green-600">
                      {RenderPriceInUSD(totalPrice)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Items</p>
                  <p className="flex items-center gap-2">{totalQty} item</p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Delivery Charge</p>
                  <p className="flex items-center gap-2">Free</p>
                </div>
                <div className="font-semibold flex items-center justify-between gap-4">
                  <p>Total</p>
                  <p>{RenderPriceInUSD(totalPrice)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white flex flex-col justify-center items-center">
              <img
                src={imageEmpty}
                className="w-full h-full object-scale-down"
              />
              <Link
                onClick={close}
                to={"/"}
                className="block bg-green-600 px-4 py-2 text-white rounded"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>

        {cartItem[0] && (
          <div className="p-2">
            <div className="bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 static bottom-3 rounded flex items-center gap-4 justify-between">
              <div>{RenderPriceInUSD(totalPrice)}</div>
              <button
                onClick={redirectToCheckoutPage}
                className="flex items-center gap-1"
              >
                Proceed
                <span>
                  <FaCaretRight />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
