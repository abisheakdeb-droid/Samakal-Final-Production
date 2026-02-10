"use client";

import { useRouter } from "next/navigation";
import { CATEGORY_MAP } from "@/config/categories";
import { SUB_CATEGORIES } from "@/config/sub-categories";
import { ChevronDown, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SaradeshFilterProps {
  currentSlug: string;
}

export default function SaradeshFilter({ currentSlug }: SaradeshFilterProps) {
  // ... existing hooks and state ...
  const router = useRouter();

  // Initialize state based on current URL slug
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Determine initial state from slug
  useEffect(() => {
    // Check if currentSlug is a division
    if (SUB_CATEGORIES["saradesh"].includes(currentSlug)) {
      setSelectedDivision(currentSlug);
      setSelectedDistrict("");
    }
    // Check if currentSlug is a district (search in all divisions)
    else {
      let foundDivision = "";
      for (const division of SUB_CATEGORIES["saradesh"]) {
        if (SUB_CATEGORIES[division]?.includes(currentSlug)) {
          foundDivision = division;
          break;
        }
      }
      if (foundDivision) {
        setSelectedDivision(foundDivision);
        setSelectedDistrict(currentSlug);
      } else if (currentSlug === "saradesh") {
        setSelectedDivision("");
        setSelectedDistrict("");
      }
    }
  }, [currentSlug]);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const division = e.target.value;
    setSelectedDivision(division);
    setSelectedDistrict(""); // Reset district

    if (division) {
      router.push(`/category/${division}`);
    } else {
      router.push(`/category/saradesh`);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);

    if (district) {
      router.push(`/category/${district}`);
    } else if (selectedDivision) {
      // If district is cleared but division remains
      router.push(`/category/${selectedDivision}`);
    }
  };

  const divisions = SUB_CATEGORIES["saradesh"];
  const districts = selectedDivision ? SUB_CATEGORIES[selectedDivision] : [];

  return (
    <div className="w-full border-b border-gray-100 mb-8 bg-white/80 backdrop-blur-sm sticky top-28 md:top-30 z-40 transition-all">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-brand-red font-bold whitespace-nowrap">
            <MapPin size={20} />
            <span>এলাকা নির্বাচন করুন:</span>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* Division Dropdown */}
            <div className="relative w-full md:w-64 group">
              <select
                value={selectedDivision}
                onChange={handleDivisionChange}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red cursor-pointer transition-all font-medium"
              >
                <option value="">সকল বিভাগ</option>
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {CATEGORY_MAP[div] || div}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 group-hover:text-brand-red transition-colors">
                <ChevronDown size={16} />
              </div>
            </div>

            {/* District Dropdown */}
            <div className="relative w-full md:w-64 group">
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedDivision}
                className={cn(
                  "w-full appearance-none border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all font-medium",
                  !selectedDivision
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 cursor-pointer",
                )}
              >
                <option value="">
                  {!selectedDivision ? "আগে বিভাগ নির্বাচন করুন" : "সকল জেলা"}
                </option>
                {districts?.map((dist) => (
                  <option key={dist} value={dist}>
                    {CATEGORY_MAP[dist] || dist}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 group-hover:text-brand-red transition-colors">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
