import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FaSmile, FaUsers, FaBoxOpen, FaStar } from "react-icons/fa";

const Statistics = () => {
  const { t } = useTranslation();
  const [cooperativesCount, setCooperativesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchDynamicStats();
  }, []);

  const fetchDynamicStats = async () => {
    try {
      setLoadingStats(true);
      const [coopRes, prodRes] = await Promise.all([
        axios.get("http://localhost:8000/api/cooperatives"),
        axios.get("http://localhost:8000/api/products")
      ]);

      if (coopRes.data.success) {
        setCooperativesCount(coopRes.data.data.length);
      }
      if (prodRes.data.success) {
        setProductsCount(prodRes.data.data.length);
      }
    } catch (err) {
      console.error("Error fetching dynamic stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="mt-0">
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 rounded-2xl p-6 lg:p-10 shadow-lg border-b-4 border-emerald-500 mx-4 sm:mx-6 lg:mx-auto lg:max-w-7xl my-8">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-4">

          

          {/* Stat 2: Cooperatives */}
          <div className="text-center space-y-1 border-l border-emerald-700/50">
            <div className="text-amber-400 text-lg sm:text-xl flex justify-center"><FaUsers /></div>
            <div className="text-2xl lg:text-3xl font-black text-white">
              {loadingStats ? "..." : `${cooperativesCount}+`}
            </div>
            <div className="text-emerald-100/80 text-[11px] font-bold uppercase tracking-wider">
              {t("testimonials.statCooperatives")}
            </div>
          </div>

          {/* Stat 3: Products */}
          <div className="text-center space-y-1 border-l border-emerald-700/50">
            <div className="text-amber-400 text-lg sm:text-xl flex justify-center"><FaBoxOpen /></div>
            <div className="text-2xl lg:text-3xl font-black text-white">
              {loadingStats ? "..." : `${productsCount}+`}
            </div>
            <div className="text-emerald-100/80 text-[11px] font-bold uppercase tracking-wider">
              {t("testimonials.statProducts")}
            </div>
          </div>

          

        </div>
      </div>
    </div>
  );
};

export default Statistics;
