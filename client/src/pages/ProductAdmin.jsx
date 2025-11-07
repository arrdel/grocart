import React, { useState, useEffect } from "react";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from "../components/EditProductAdmin";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 18,
          search: search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage);
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((preve) => preve + 1);
    }
  };
  const handlePrevious = () => {
    if (page > 1) {
      setPage((preve) => preve - 1);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true;

    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false;
      }
    }, 300);

    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Products</h2>
          <div className="w-full sm:max-w-md ml-auto relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500">
              <IoSearchOutline size={20} />
            </div>
            <input
              type="text"
              placeholder="Search products by name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200 transition-all duration-200"
              value={search}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loading />
          </div>
        ) : (
          <>
            <div className="min-h-[60vh] bg-white rounded-lg shadow-sm border p-4">
              {productData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                  <IoSearchOutline size={48} className="mb-2 text-gray-300" />
                  <p>No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {productData.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden"
                    >
                      <ProductCardAdmin
                        data={p}
                        fetchProductData={fetchProductData}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={handlePrevious}
                disabled={page <= 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              <div className="flex items-center gap-1 text-sm">
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-md font-medium text-gray-700">
                  {page}
                </span>
                <span className="text-gray-500">of</span>
                <span className="text-gray-700">{totalPageCount}</span>
              </div>
              <button
                onClick={handleNext}
                disabled={page >= totalPageCount}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductAdmin;
