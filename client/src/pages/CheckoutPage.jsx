import React, { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { RenderPriceInUSD } from "../utils/RenderPriceInUSD";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const {
    notDiscountTotalPrice,
    totalPrice,
    totalQty,
    fetchCartItem,
    fetchOrder,
  } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();

  // Check authentication on mount
  React.useEffect(() => {
    const accessToken = localStorage.getItem("accesstoken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      toast.error("Please login to continue");
      navigate("/login");
    }
  }, [navigate]);

  // Validation function for orders
  const validateOrder = () => {
    if (cartItemsList.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    if (!addressList || addressList.length === 0) {
      toast.error("Please add a delivery address");
      setOpenAddress(true);
      return false;
    }

    if (!addressList[selectAddress]) {
      toast.error("Please select a delivery address");
      return false;
    }

    return true;
  };

  const handleCashOnDelivery = async () => {
    if (!validateOrder()) return;

    setIsProcessing(true);
    const loadingToast = toast.loading("Processing your order...");

    try {
      // Validate the data before sending
      if (!cartItemsList?.length) {
        throw new Error("Cart items are missing");
      }

      // Debug cart items structure
      console.log(
        "Cart Items Structure:",
        cartItemsList.map((item) => ({
          id: item.productId?._id,
          name: item.productId?.name,
          price: item.productId?.price,
          qty: item.quantity,
        }))
      );

      // Validate cart items have required data
      const invalidItems = cartItemsList.filter(
        (item) => !item?.productId?._id || !item?.quantity
      );

      if (invalidItems.length > 0) {
        console.error("Invalid cart items found:", invalidItems);
        throw new Error(
          "Some items in your cart are invalid. Please refresh and try again."
        );
      }

      if (!addressList[selectAddress]?._id) {
        throw new Error("Invalid address selected");
      }

      // Debug selected address
      console.log("Selected Address:", addressList[selectAddress]);

      const orderData = {
        list_items: cartItemsList.map((item) => ({
          productId: item.productId, // Send the entire product object as backend expects it
          quantity: item.quantity, // Use quantity instead of qty
        })),
        addressId: addressList[selectAddress]._id,
        subTotalAmt: totalPrice,
        totalAmt: totalPrice,
      };

      console.log("=== Final Order Data ===");
      console.log("Full orderData:", JSON.stringify(orderData, null, 2));
      console.log("First item structure:", orderData.list_items[0]);
      console.log("First item productId:", orderData.list_items[0]?.productId);
      console.log(
        "First item productId._id:",
        orderData.list_items[0]?.productId?._id
      );

      console.log(
        "API Endpoint:",
        baseURL + SummaryApi.CashOnDeliveryOrder.url
      );
      console.log("Sending order data:", orderData);

      // Check authentication before making request
      const accessToken = localStorage.getItem("accesstoken");
      const refreshToken = localStorage.getItem("refreshToken");

      console.log("=== Auth Check Before Request ===");
      console.log("Access token exists:", !!accessToken);
      console.log("Refresh token exists:", !!refreshToken);

      if (!accessToken || !refreshToken) {
        toast.error("Your session has expired. Please login again.");
        navigate("/login");
        return;
      }

      // Log the full request details for debugging
      console.log(
        "Making request to:",
        baseURL + SummaryApi.CashOnDeliveryOrder.url
      );

      // Let Axios interceptor handle the token automatically
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: orderData,
      });

      console.log("Server response:", response);

      const { data: responseData } = response;

      if (!responseData) {
        throw new Error("No response data received from server");
      }

      if (!responseData.success) {
        throw new Error(responseData.message || "Order placement failed");
      }

      // Update cart and order data
      try {
        await Promise.all([fetchCartItem?.(), fetchOrder?.()]);
      } catch (updateError) {
        console.error("Error updating cart/order data:", updateError);
        // Don't throw here, as the order was still successful
      }

      toast.success(responseData.message || "Order placed successfully");
      navigate("/success", {
        state: {
          text: "Order",
          orderId: responseData.orderId,
        },
      });
    } catch (error) {
      console.error("Cash on Delivery Error:", error);
      // Check for specific error types
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response);
        if (error.response.status === 404) {
          toast.error(
            "Order service is currently unavailable. Please try again later."
          );
        } else {
          toast.error(
            error.response.data?.message ||
              "Failed to process order. Please try again."
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", error.message);
        toast.error(
          error.message || "Failed to place order. Please try again."
        );
      }
    } finally {
      setIsProcessing(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleOnlinePayment = async () => {
    // First verify authentication
    const accessToken = localStorage.getItem("accesstoken");
    const refreshToken = localStorage.getItem("refreshToken");

    console.log("=== Online Payment Auth Check ===");
    console.log("Access token exists:", !!accessToken);
    console.log("Refresh token exists:", !!refreshToken);

    if (!accessToken || !refreshToken) {
      toast.error("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    if (!validateOrder()) return;

    const loadingToast = toast.loading("Processing payment...");
    setIsProcessing(true);

    try {
      console.log("=== Starting Online Payment ===");

      // Validate cart items before sending
      const invalidItems = cartItemsList.filter(
        (item) => !item?.productId?._id || !item?.quantity
      );

      if (invalidItems.length > 0) {
        console.error("Invalid cart items found:", invalidItems);
        throw new Error(
          "Some items in your cart are invalid. Please refresh and try again."
        );
      }

      const paymentData = {
        list_items: cartItemsList.map((item) => ({
          productId: item.productId, // Send the entire product object
          quantity: item.quantity,
        })),
        addressId: addressList[selectAddress]?._id,
        subTotalAmt: totalPrice,
        totalAmt: totalPrice,
      };

      console.log("=== Payment Request Data ===");
      console.log("Items count:", paymentData.list_items.length);
      console.log("Address ID:", paymentData.addressId);
      console.log("Total:", paymentData.totalAmt);
      console.log("First item:", paymentData.list_items[0]);

      console.log("Sending payment request...");
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: paymentData,
      });

      console.log("=== Payment Response ===");
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      const { data: responseData } = response;

      if (!responseData?.url) {
        console.error("No checkout URL in response:", responseData);
        throw new Error("Invalid payment session - no checkout URL received");
      }

      console.log("Redirecting to Stripe checkout URL:", responseData.url);

      // Update cart before redirect
      try {
        await Promise.all([
          fetchCartItem && fetchCartItem(),
          fetchOrder && fetchOrder(),
        ]);
      } catch (updateError) {
        console.error("Error updating cart before redirect:", updateError);
        // Don't block the redirect
      }

      // Redirect to Stripe Checkout using the URL
      window.location.href = responseData.url;
    } catch (error) {
      console.error("=== Online Payment Error ===");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Full error:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        toast.error(
          error.response.data?.message ||
            "Payment processing failed. Please try again."
        );
      } else if (error.request) {
        console.error("No response received");
        toast.error(
          "Unable to connect to payment server. Please check your connection."
        );
      } else {
        console.error("Error setting up request:", error.message);
        toast.error(
          error.message || "Payment initialization failed. Please try again."
        );
      }

      setIsProcessing(false);
    } finally {
      toast.dismiss(loadingToast);
    }
  };
  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          {/***address***/}
          <h3 className="text-lg font-semibold">Select Address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => {
              return (
                <label
                  key={index}
                  htmlFor={"address" + index}
                  className={!address.status ? "hidden" : "block w-full"}
                >
                  <div
                    className={`border rounded p-3 flex gap-3 hover:bg-blue-50 transition-colors ${
                      Number(selectAddress) === index
                        ? "border-primary-600 bg-primary-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        id={"address" + index}
                        type="radio"
                        value={index}
                        checked={Number(selectAddress) === index}
                        onChange={(e) =>
                          setSelectAddress(Number(e.target.value))
                        }
                        name="address"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{address.address_line}</p>
                      <p className="text-gray-600">{address.city}</p>
                      <p className="text-gray-600">{address.state}</p>
                      <p className="text-gray-600">
                        {address.country} - {address.pincode}
                      </p>
                      <p className="text-gray-600">{address.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add address
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2">
          {/**summary**/}
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-4">
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
              <p className="text-green-600">{RenderPriceInUSD(totalPrice)}</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 mt-6">
            <button
              className="py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleOnlinePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Pay Online"
              )}
            </button>

            <button
              className="py-3 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleCashOnDelivery}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Cash On Delivery"
              )}
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;

// import React, { useState } from "react";
// import { useGlobalContext } from "../provider/GlobalProvider";
// import { RenderPriceInUSD } from "../utils/RenderPriceInUSD";
// import AddAddress from "../components/AddAddress";
// import { useSelector } from "react-redux";
// import AxiosToastError from "../utils/AxiosToastError";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";

// const CheckoutPage = () => {
//   const {
//     notDiscountTotalPrice,
//     totalPrice,
//     totalQty,
//     fetchCartItem,
//     fetchOrder,
//   } = useGlobalContext();
//   const [openAddress, setOpenAddress] = useState(false);
//   const addressList = useSelector((state) => state.addresses.addressList);
//   const [selectAddress, setSelectAddress] = useState(0);
//   const cartItemsList = useSelector((state) => state.cartItem.cart);
//   const navigate = useNavigate();

//   const handleCashOnDelivery = async () => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.CashOnDeliveryOrder,
//         data: {
//           list_items: cartItemsList,
//           addressId: addressList[selectAddress]?._id,
//           subTotalAmt: totalPrice,
//           totalAmt: totalPrice,
//         },
//       });

//       const { data: responseData } = response;

//       if (responseData.success) {
//         toast.success(responseData.message);
//         if (fetchCartItem) {
//           fetchCartItem();
//         }
//         if (fetchOrder) {
//           fetchOrder();
//         }
//         navigate("/success", {
//           state: {
//             text: "Order",
//           },
//         });
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   const handleOnlinePayment = async () => {
//     try {
//       toast.loading("Loading...");
//       const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
//       const stripePromise = await loadStripe(stripePublicKey);

//       const response = await Axios({
//         ...SummaryApi.payment_url,
//         data: {
//           list_items: cartItemsList,
//           addressId: addressList[selectAddress]?._id,
//           subTotalAmt: totalPrice,
//           totalAmt: totalPrice,
//         },
//       });

//       const { data: responseData } = response;

//       stripePromise.redirectToCheckout({ sessionId: responseData.id });

//       if (fetchCartItem) {
//         fetchCartItem();
//       }
//       if (fetchOrder) {
//         fetchOrder();
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };
//   return (
//     <section className="bg-blue-50">
//       <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
//         <div className="w-full">
//           {/***address***/}
//           <h3 className="text-lg font-semibold">Choose your address</h3>
//           <div className="bg-white p-2 grid gap-4">
//             {addressList.map((address, index) => {
//               return (
//                 <label
//                   htmlFor={"address" + index}
//                   className={!address.status && "hidden"}
//                 >
//                   <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
//                     <div>
//                       <input
//                         id={"address" + index}
//                         type="radio"
//                         value={index}
//                         onChange={(e) => setSelectAddress(e.target.value)}
//                         name="address"
//                       />
//                     </div>
//                     <div>
//                       <p>{address.address_line}</p>
//                       <p>{address.city}</p>
//                       <p>{address.state}</p>
//                       <p>
//                         {address.country} - {address.pincode}
//                       </p>
//                       <p>{address.mobile}</p>
//                     </div>
//                   </div>
//                 </label>
//               );
//             })}
//             <div
//               onClick={() => setOpenAddress(true)}
//               className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
//             >
//               Add address
//             </div>
//           </div>
//         </div>

//         <div className="w-full max-w-md bg-white py-4 px-2">
//           {/**summary**/}
//           <h3 className="text-lg font-semibold">Summary</h3>
//           <div className="bg-white p-4">
//             <h3 className="font-semibold">Bill details</h3>
//             <div className="flex gap-4 justify-between ml-1">
//               <p>Items total</p>
//               <p className="flex items-center gap-2">
//                 <span className="line-through text-neutral-400">
//                   {RenderPriceInUSD(notDiscountTotalPrice)}
//                 </span>
//                 <span>{RenderPriceInUSD(totalPrice)}</span>
//               </p>
//             </div>
//             <div className="flex gap-4 justify-between ml-1">
//               <p>Quntity total</p>
//               <p className="flex items-center gap-2">{totalQty} item</p>
//             </div>
//             <div className="flex gap-4 justify-between ml-1">
//               <p>Delivery Charge</p>
//               <p className="flex items-center gap-2">Free</p>
//             </div>
//             <div className="font-semibold flex items-center justify-between gap-4">
//               <p>Grand total</p>
//               <p>{RenderPriceInUSD(totalPrice)}</p>
//             </div>
//           </div>
//           <div className="w-full flex flex-col gap-4">
//             <button
//               className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
//               onClick={handleOnlinePayment}
//             >
//               Online Payment
//             </button>

//             <button
//               className="py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white"
//               onClick={handleCashOnDelivery}
//             >
//               Cash on Delivery
//             </button>
//           </div>
//         </div>
//       </div>

//       {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
//     </section>
//   );
// };

// export default CheckoutPage;
