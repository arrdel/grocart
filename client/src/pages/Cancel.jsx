import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTimesCircle,
  FaShoppingCart,
  FaRedo,
  FaHome,
  FaQuestionCircle,
} from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";

const Cancel = () => {
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);

  const reason = location?.state?.reason || "Payment was cancelled";

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <div
        className={`w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
          showContent ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header Section with animated X icon */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="inline-block mb-4 animate-shake">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <FaTimesCircle className="text-red-600 text-6xl animate-scale-in" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in">
              Order Cancelled
            </h1>
            <p className="text-red-50 text-lg animate-fade-in-delay">
              Your payment was not completed
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-10">
          {/* Cancellation Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Don't Worry!
            </h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Your order was not processed. No charges have been made to your
              account.
            </p>
            <p className="text-gray-500 text-sm">{reason}</p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200">
              <FaShoppingCart className="text-blue-600 text-3xl mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">Cart Saved</p>
              <p className="text-xs text-gray-500 mt-1">Items still in cart</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200">
              <FaRedo className="text-green-600 text-3xl mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">Try Again</p>
              <p className="text-xs text-gray-500 mt-1">Retry anytime</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200">
              <MdSupportAgent className="text-purple-600 text-3xl mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">Need Help?</p>
              <p className="text-xs text-gray-500 mt-1">We're here for you</p>
            </div>
          </div>

          {/* Reasons/Tips Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-8">
            <div className="flex items-start gap-3">
              <FaQuestionCircle className="text-yellow-600 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Common Reasons for Cancellation:
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Payment method declined or expired</li>
                  <li>• Insufficient funds in account</li>
                  <li>• Browser or connection interrupted</li>
                  <li>• Manual cancellation during checkout</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/checkout"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            >
              <FaRedo className="text-lg" />
              Try Again
            </Link>
            <Link
              to="/cart"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            >
              <FaShoppingCart className="text-lg" />
              View Cart
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 transition-all px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            >
              <FaHome className="text-lg" />
              Go Home
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p className="mb-2">Having trouble completing your order?</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Contact Support
            </button>
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

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
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

        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Cancel;
