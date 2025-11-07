import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaTruck, FaHome } from "react-icons/fa";
import { IoReceipt } from "react-icons/io5";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const Success = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showContent, setShowContent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { fetchCartItem, fetchOrder } = useGlobalContext();

  const orderType = location?.state?.text || "Payment";
  const orderId = location?.state?.orderId;
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // If this is a Stripe payment (has session_id), verify and complete the order
    const verifyStripePayment = async () => {
      if (!sessionId || isProcessing) return;

      setIsProcessing(true);
      console.log("=== Verifying Stripe Payment ===");
      console.log("Session ID:", sessionId);

      try {
        const response = await Axios({
          ...SummaryApi.verifyPayment,
          data: { sessionId },
        });

        console.log("Verification response:", response.data);

        if (response.data.success) {
          toast.success("Order completed successfully!");

          // Refresh cart and orders
          if (fetchCartItem) await fetchCartItem();
          if (fetchOrder) await fetchOrder();
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        // Don't show error to user if order was already processed
        if (error.response?.data?.message !== "Order already processed") {
          toast.error(
            error.response?.data?.message ||
              "Failed to complete order. Please contact support."
          );
        } else {
          // Order already processed, just refresh data
          if (fetchCartItem) await fetchCartItem();
          if (fetchOrder) await fetchOrder();
        }
      } finally {
        setIsProcessing(false);
      }
    };

    verifyStripePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div
        className={`w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
          showContent ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header Section with animated checkmark */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="inline-block mb-4 animate-bounce">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <FaCheckCircle className="text-green-600 text-6xl animate-scale-in" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in">
              Success!
            </h1>
            <p className="text-green-50 text-lg animate-fade-in-delay">
              {orderType} Completed Successfully
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-10">
          {/* Order Confirmation Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Thank You for Your Order!
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your order has been placed successfully and is being processed.
              We'll send you a confirmation email shortly.
            </p>
          </div>

          {/* Order ID Display */}
          {orderId && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6 border border-green-200">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <IoReceipt className="text-green-600 text-xl" />
                <span className="font-medium">Order ID:</span>
                <span className="font-bold text-green-700">{orderId}</span>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200">
              <FaShoppingBag className="text-green-600 text-3xl mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">
                Order Confirmed
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200">
              <FaTruck className="text-blue-600 text-3xl mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">Fast Delivery</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200">
              <IoReceipt className="text-purple-600 text-3xl mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">Email Receipt</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            >
              <FaHome className="text-lg" />
              Continue Shopping
            </Link>
            <Link
              to="/dashboard/myorders"
              className="flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-all px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            >
              <FaShoppingBag className="text-lg" />
              View Orders
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Questions about your order? Contact our support team</p>
          </div>
        </div>
      </div>

      {/* Add custom animations in style tag */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.6s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
};

export default Success;
