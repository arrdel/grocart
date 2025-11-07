// import React from "react";
// import { useSelector } from "react-redux";
// import NoData from "../components/NoData";

// const MyOrders = () => {
//   const orders = useSelector((state) => state.orders.order);

//   console.log("order Items", orders);
//   return (
//     <div>
//       <div className="bg-white shadow-md p-3 font-semibold">
//         <h1>Order</h1>
//       </div>
//       {!orders[0] && <NoData />}
//       {orders.map((order, index) => {
//         return (
//           <div
//             key={order._id + index + "order"}
//             className="order rounded p-4 text-sm"
//           >
//             <p>Order No : {order?.orderId}</p>
//             <div className="flex gap-3">
//               <img src={order.product_details.image[0]} className="w-14 h-14" />
//               <p className="font-medium">{order.product_details.name}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default MyOrders;

// import React from "react";
// import { useSelector } from "react-redux";
// import NoData from "../components/NoData";

// const MyOrders = () => {
//   const orders = useSelector((state) => state.orders?.order || []);

//   console.log("order Items", orders);
//   return (
//     <div>
//       <div className="bg-white shadow-lg  p-3 font-semibold">
//         <h1>Orders</h1>
//       </div>
//       {orders.length === 0 && <NoData />}
//       {orders.length > 0 &&
//         orders.map((order, index) => {
//           return (
//             <div
//               key={order._id + index + "order"}
//               className="order rounded p-4 text-sm bg-white shadow-sm mt-4 hover:shadow-md transition-shadow"
//             >
//               <p className="text-gray-600 mb-3">
//                 Order No:{" "}
//                 <span className="font-medium text-gray-900">
//                   {order?.orderId}
//                 </span>
//               </p>
//               <div className="flex gap-4 items-center">
//                 <img
//                   src={order?.product_details?.image?.[0]}
//                   alt={order?.product_details?.name}
//                   className="w-16 h-16 object-cover rounded-lg border border-gray-100"
//                 />
//                 <div>
//                   <p className="font-medium text-gray-900">
//                     {order?.product_details?.name}
//                   </p>
//                   <p className="text-gray-500 text-xs mt-1">
//                     Status: {order?.status || "Processing"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//     </div>
//   );
// };

// export default MyOrders;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NoData from "../components/NoData";
import { useGlobalContext } from "../provider/GlobalProvider";
import {
  IoClose,
  IoReceipt,
  IoCalendar,
  IoCard,
  IoLocation,
} from "react-icons/io5";
import { FaBox, FaCheckCircle, FaClock } from "react-icons/fa";

const MyOrders = () => {
  const orders = useSelector((state) => state.orders?.order || []);
  const { fetchOrder } = useGlobalContext();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Fetch orders when component mounts
    console.log("MyOrders component mounted, fetching orders...");
    if (fetchOrder) {
      fetchOrder();
    }
  }, [fetchOrder]);

  console.log("=== MyOrders Debug ===");
  console.log("Orders from Redux:", orders);
  console.log("Orders count:", orders.length);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    console.log("Selected order:", order);
  };

  const closeReceipt = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div
        className={`p-4 transition-all duration-300 ${
          selectedOrder ? "mr-96" : ""
        }`}
      >
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600 text-sm mt-1">
            {orders.length > 0
              ? `You have ${orders.length} order(s)`
              : "No orders yet"}
          </p>
        </div>

        {orders.length === 0 && <NoData />}

        {orders.length > 0 && (
          <div className="grid gap-4">
            {orders.map((order, index) => {
              console.log(`Rendering order ${index}:`, order);
              return (
                <div
                  key={order._id + index + "order"}
                  onClick={() => handleOrderClick(order)}
                  className="order rounded-lg p-4 bg-white shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-500"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-3 pb-3 border-b">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FaBox className="text-green-600" />
                        <p className="text-sm text-gray-500">Order No</p>
                      </div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {order?.orderId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                          order?.payment_status === "paid"
                            ? "bg-green-100 text-green-700"
                            : order?.payment_status === "CASH ON DELIVERY"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order?.payment_status === "paid" ? (
                          <FaCheckCircle />
                        ) : (
                          <FaClock />
                        )}
                        {order?.payment_status || "Pending"}
                      </p>
                    </div>
                  </div>

                  {/* Order Date */}
                  <div className="flex items-center gap-2 mb-3 text-gray-600 text-sm">
                    <IoCalendar className="text-gray-400" />
                    <span>{formatDate(order?.createdAt)}</span>
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-4 items-center">
                    <img
                      src={order?.product_details?.image?.[0]}
                      alt={order?.product_details?.name}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        {order?.product_details?.name}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        Amount:{" "}
                        <span className="font-bold text-green-600">
                          ${order?.totalAmt?.toFixed(2) || "0.00"}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <IoReceipt className="text-2xl text-gray-400" />
                      <p className="text-xs text-gray-500 mt-1">View Details</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Receipt Side Panel */}
      {selectedOrder && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={closeReceipt}
          ></div>

          {/* Receipt Panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <IoReceipt className="text-2xl" />
                    <h2 className="text-xl font-bold">Order Receipt</h2>
                  </div>
                  <p className="text-green-100 text-sm">
                    {selectedOrder?.orderId}
                  </p>
                </div>
                <button
                  onClick={closeReceipt}
                  className="p-2 hover:bg-green-800 rounded-full transition-colors"
                >
                  <IoClose className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="p-6">
              {/* Order Status */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Order Status</p>
                <div className="flex items-center justify-between">
                  <p
                    className={`text-lg font-bold ${
                      selectedOrder?.payment_status === "paid"
                        ? "text-green-600"
                        : selectedOrder?.payment_status === "CASH ON DELIVERY"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {selectedOrder?.payment_status || "Pending"}
                  </p>
                  {selectedOrder?.payment_status === "paid" && (
                    <FaCheckCircle className="text-green-600 text-xl" />
                  )}
                </div>
              </div>

              {/* Order Date */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <IoCalendar className="text-lg" />
                  <p className="text-sm font-medium">Order Date</p>
                </div>
                <p className="text-gray-800 ml-6">
                  {formatDate(selectedOrder?.createdAt)}
                </p>
              </div>

              {/* Payment Information */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <IoCard className="text-lg" />
                  <p className="text-sm font-medium">Payment Information</p>
                </div>
                <div className="ml-6 space-y-1">
                  <p className="text-gray-800">
                    Method: {selectedOrder?.payment_status || "N/A"}
                  </p>
                  {selectedOrder?.paymentId && (
                    <p className="text-gray-600 text-sm">
                      Payment ID: {selectedOrder?.paymentId}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder?.delivery_address && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <IoLocation className="text-lg" />
                    <p className="text-sm font-medium">Delivery Address</p>
                  </div>
                  <div className="ml-6 text-gray-800">
                    {typeof selectedOrder.delivery_address === "object" ? (
                      <>
                        <p>
                          {selectedOrder.delivery_address.address_line || "N/A"}
                        </p>
                        <p>
                          {selectedOrder.delivery_address.city},{" "}
                          {selectedOrder.delivery_address.state}{" "}
                          {selectedOrder.delivery_address.pincode}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedOrder.delivery_address.mobile || ""}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-600">
                        Address details not available
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-600 mb-3">
                  Product Details
                </p>
                <div className="border rounded-lg p-4">
                  <div className="flex gap-3 mb-3">
                    <img
                      src={selectedOrder?.product_details?.image?.[0]}
                      alt={selectedOrder?.product_details?.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        {selectedOrder?.product_details?.name}
                      </p>
                      {selectedOrder?.productId && (
                        <p className="text-xs text-gray-500">
                          Product ID: {selectedOrder?.productId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${selectedOrder?.subTotalAmt?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax & Fees</span>
                      <span className="font-medium">
                        $
                        {(
                          (selectedOrder?.totalAmt || 0) -
                          (selectedOrder?.subTotalAmt || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total Amount</span>
                      <span className="text-green-600">
                        ${selectedOrder?.totalAmt?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Need help with your order?
                </p>
                <p className="text-xs text-blue-600">
                  Contact our support team for any questions or concerns.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
