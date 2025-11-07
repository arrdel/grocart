// import React from "react";
// import banner from "../assets/banner.jpg";
// import bannerMobile from "../assets/banner-mobile.jpg";
// import { useSelector } from "react-redux";
// import { valideURLConvert } from "../utils/valideURLConvert";
// import { Link, useNavigate } from "react-router-dom";
// import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";

// const Home = () => {
//   const loadingCategory = useSelector((state) => state.product.loadingCategory);
//   const categoryData = useSelector((state) => state.product.allCategory);
//   const subCategoryData = useSelector((state) => state.product.allSubCategory);
//   const navigate = useNavigate();

//   const handleRedirectProductListpage = (id, cat) => {
//     console.log(id, cat);
//     const subcategory = subCategoryData.find((sub) => {
//       const filterData = sub.category.some((c) => {
//         return c._id == id;
//       });

//       return filterData ? true : null;
//     });
//     const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
//       subcategory.name
//     )}-${subcategory._id}`;

//     navigate(url);
//     console.log(url);
//   };

//   return (
//     <section className="bg-white">
//       <div className="container mx-auto">
//         <div
//           className={`w-full h-full min-h-48 bg-blue-100 rounded ${
//             !banner && "animate-pulse my-2"
//           } `}
//         >
//           <img
//             src={banner}
//             className="w-full h-full hidden lg:block"
//             alt="banner"
//           />
//           <img
//             src={bannerMobile}
//             className="w-full h-full lg:hidden"
//             alt="banner"
//           />
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//           Browse Categories
//         </h2>
//         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
//           {loadingCategory
//             ? new Array(12).fill(null).map((c, index) => {
//                 return (
//                   <div
//                     key={index + "loadingcategory"}
//                     className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
//                   >
//                     <div className="bg-blue-100 min-h-24 rounded"></div>
//                     <div className="bg-blue-100 h-8 rounded"></div>
//                   </div>
//                 );
//               })
//             : categoryData.map((cat) => {
//                 return (
//                   <div
//                     key={cat._id + "displayCategory"}
//                     className="w-full h-full cursor-pointer group"
//                     onClick={() =>
//                       handleRedirectProductListpage(cat._id, cat.name)
//                     }
//                   >
//                     <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 flex flex-col items-center">
//                       <div className="w-full h-24 flex items-center justify-center">
//                         <img
//                           src={cat.image}
//                           className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
//                           alt={cat.name}
//                         />
//                       </div>
//                       <p className="mt-2 text-center text-sm font-medium text-gray-700 group-hover:text-primary-600">
//                         {cat.name}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//         </div>
//       </div>

//       {/***display category product */}
//       {categoryData?.map((c) => {
//         return (
//           <CategoryWiseProductDisplay
//             key={c?._id + "CategorywiseProduct"}
//             id={c?._id}
//             name={c?.name}
//           />
//         );
//       })}
//     </section>
//   );
// };

// export default Home;

import React, { useState, useEffect } from "react";
import banner from "../assets/banner.jpg";
import banner1 from "../assets/banner1.png";
import grocart_logo from "../assets/grocart_logo.png";
import bannerMobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { Link, useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import {
  FaTruck,
  FaLeaf,
  FaTag,
  FaShieldAlt,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();
  const [bannerLoaded, setBannerLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = banner;
    img.onload = () => setBannerLoaded(true);
  }, []);

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat);
    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == id;
      });

      return filterData ? true : null;
    });
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;

    navigate(url);
    console.log(url);
  };

  return (
    <section className="bg-gradient-to-r from-green-50 to-orange-50">
      {/* Hero Banner Section */}
      <div className="container mx-auto px-4 py-6">
        <div
          className={`relative w-full rounded-2xl overflow-hidden  ${
            !bannerLoaded &&
            "animate-pulse bg-gradient-to-r from-blue-100 to-green-100"
          } min-h-[200px] md:min-h-[400px]`}
        >
          {bannerLoaded && (
            <>
              <img
                src={banner1}
                className="w-full h-full object-cover hidden lg:block"
                alt="banner"
              />
              <img
                src={bannerMobile}
                className="w-full h-full object-cover lg:hidden"
                alt="banner"
              />
              {/* Overlay with gradient */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent hidden lg:flex items-center">
                <div className="container mx-auto px-12">
                  <div className="max-w-xl text-white animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      Fresh Groceries Delivered to Your Door
                    </h1>
                    <p className="text-lg md:text-xl mb-6 text-gray-100">
                      Shop from the comfort of home. Quality products at great
                      prices.
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                      Shop Now
                      <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                </div>
              </div> */}
            </>
          )}
        </div>
      </div>

      {/* Quick Features Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3 group cursor-pointer">
            <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-600 transition-colors duration-300">
              <FaTruck className="text-green-600 text-xl group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">
                Free Delivery
              </h4>
              <p className="text-xs text-gray-500">On orders over $50</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3 group cursor-pointer">
            <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-600 transition-colors duration-300">
              <FaLeaf className="text-blue-600 text-xl group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">
                100% Fresh
              </h4>
              <p className="text-xs text-gray-500">Quality guaranteed</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3 group cursor-pointer">
            <div className="bg-orange-100 p-3 rounded-full group-hover:bg-orange-600 transition-colors duration-300">
              <FaTag className="text-orange-600 text-xl group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">
                Best Prices
              </h4>
              <p className="text-xs text-gray-500">Deals every day</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3 group cursor-pointer">
            <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-600 transition-colors duration-300">
              <FaShieldAlt className="text-purple-600 text-xl group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">
                Secure Pay
              </h4>
              <p className="text-xs text-gray-500">Safe checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Shop by Category
            </h2>
            <p className="text-gray-600">
              Browse our wide range of fresh products
            </p>
          </div>
          <Link
            to="/categories"
            className="hidden md:flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold group"
          >
            View All
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {loadingCategory
            ? new Array(12).fill(null).map((c, index) => {
                return (
                  <div
                    key={index + "loadingcategory"}
                    className="bg-white rounded-2xl p-4 min-h-40 grid gap-2 shadow-md animate-pulse"
                  >
                    <div className="bg-gradient-to-br from-gray-200 to-gray-300 min-h-28 rounded-xl"></div>
                    <div className="bg-gray-200 h-4 rounded-lg"></div>
                    <div className="bg-gray-200 h-3 rounded-lg w-2/3"></div>
                  </div>
                );
              })
            : categoryData.map((cat, index) => {
                return (
                  <div
                    key={cat._id + "displayCategory"}
                    className="w-full h-full cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() =>
                      handleRedirectProductListpage(cat._id, cat.name)
                    }
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 flex flex-col items-center border-2 border-transparent hover:border-green-500 transform hover:-translate-y-2 h-full">
                      <div className="w-full aspect-square flex items-center justify-center  rounded-xl p-4 mb-4 overflow-hidden">
                        <img
                          src={cat.image}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          alt={cat.name}
                        />
                      </div>
                      <p className="text-center text-sm md:text-base font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                        {cat.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore now →
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* View All Mobile */}
        <div className="md:hidden mt-6 text-center">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
          >
            View All Categories
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Why Choose GroCart?
            </h2>
            <p className="text-green-50 text-lg">
              Your trusted partner for fresh groceries and daily essentials
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaClock className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-black  mb-3">
                Quick Delivery
              </h3>
              <p className="text-black leading-relaxed">
                Get your groceries delivered within hours. Same-day delivery
                available for orders placed before 2 PM.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaLeaf className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">
                Fresh Products
              </h3>
              <p className="text-black leading-relaxed">
                Handpicked fresh items sourced directly from local farms.
                Quality assurance on every product.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaTag className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-black  mb-3">
                Best Prices
              </h3>
              <p className="text-black leading-relaxed">
                Competitive prices on all your favorites. Special deals and
                discounts updated daily.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Products */}
      <div className="py-16">
        {categoryData?.map((c) => {
          return (
            <div
              key={c?._id + "CategorywiseProduct"}
              className="mb-16 last:mb-0"
            >
              <CategoryWiseProductDisplay id={c?._id} name={c?.name} />
            </div>
          );
        })}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out both;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Home;
