import React, { useEffect, useState } from "react";
import { vendorService } from "../services/vendorService";
import toast from "react-hot-toast";

const VendorSelect = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActiveVendors = async () => {
      setLoading(true);

      try {
        // Fetch only active vendors for purchase selection
        const res = await vendorService.getVendors("", false);

        if (res?.success) {
          setVendors(Array.isArray(res.data) ? res.data : []);
        } else {
          setVendors([]);
        }
      } catch (error) {
        console.error("Vendor loading error:", error);

        const msg =
          error?.response?.data?.message ||
          "Failed to load vendors";

        toast.error(msg);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveVendors();
  }, []);

  return (
    <div className="w-full min-w-0">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        aria-label="Select Vendor"
        className={`
          block
          w-full
          min-w-0
          h-11
          sm:h-12
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          sm:px-4
          text-xs
          sm:text-sm
          text-slate-800
          font-medium
          outline-none
          transition-all
          duration-200
          appearance-auto
          focus:border-[#1E3A8A]
          focus:ring-2
          focus:ring-[#1E3A8A]/20
          disabled:bg-slate-100
          disabled:text-slate-400
          disabled:cursor-not-allowed
          ${className}
        `}
      >
        <option value="">
          {loading ? "Loading vendors..." : "Select Vendor..."}
        </option>

        {!loading &&
          vendors.map((vendor) => (
            <option
              key={vendor._id}
              value={vendor._id}
            >
              {vendor.name}
              {vendor.companyName
                ? ` (${vendor.companyName})`
                : ""}
            </option>
          ))}
      </select>
    </div>
  );
};

export default VendorSelect;