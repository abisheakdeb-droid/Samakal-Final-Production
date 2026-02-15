"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, X, Search, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SUB_CATEGORIES } from "@/config/sub-categories";
import { CATEGORY_MAP } from "@/config/categories";
import { cn } from "@/lib/utils";

interface SaradeshFilterProps {
  currentSlug: string;
}

export default function SaradeshFilter({ currentSlug }: SaradeshFilterProps) {
  const router = useRouter();

  // Derived state from currentSlug
  const selection = useMemo(() => {
    if (SUB_CATEGORIES["saradesh"].includes(currentSlug)) {
      return { division: currentSlug, district: "" };
    } else {
      let foundDivision = "";
      for (const division of SUB_CATEGORIES["saradesh"]) {
        if (SUB_CATEGORIES[division]?.includes(currentSlug)) {
          foundDivision = division;
          break;
        }
      }
      if (foundDivision) {
        return { division: foundDivision, district: currentSlug };
      }
      return { division: "", district: "" };
    }
  }, [currentSlug]);

  // State initialized directly from derived selection
  const [selectedDivision, setSelectedDivision] = useState(selection.division);
  const [selectedDistrict, setSelectedDistrict] = useState(selection.district);
  const [isDivOpen, setIsDivOpen] = useState(false);
  const [isDistOpen, setIsDistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const divRef = useRef<HTMLDivElement>(null);
  const distRef = useRef<HTMLDivElement>(null);

  // Sync state with props when currentSlug changes
  useEffect(() => {
    // Only update if changed to avoid loops/unnecessary renders
    if (selectedDivision !== selection.division) {
      setSelectedDivision(selection.division);
    }
    if (selectedDistrict !== selection.district) {
      setSelectedDistrict(selection.district);
    }
  }, [selection, selectedDivision, selectedDistrict]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node))
        setIsDivOpen(false);
      if (distRef.current && !distRef.current.contains(event.target as Node))
        setIsDistOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const divisions = SUB_CATEGORIES["saradesh"] || [];
  const districts = selectedDivision
    ? SUB_CATEGORIES[selectedDivision] || []
    : [];

  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
    setSelectedDistrict("");
    setIsDivOpen(false);
    router.push(division ? `/category/${division}` : `/category/saradesh`);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setIsDistOpen(false);
    router.push(
      district ? `/category/${district}` : `/category/${selectedDivision}`,
    );
  };

  const filteredDistricts = districts.filter((d) =>
    (CATEGORY_MAP[d] || d).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full border-b border-gray-100 mb-8 bg-white/80 backdrop-blur-sm sticky top-28 md:top-30 z-40 transition-all">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Breadcrumbs & Label */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-red-600 font-bold px-3 py-1.5 bg-red-50 rounded-full text-sm">
              <MapPin size={16} />
              <span>সারা দেশ</span>
            </div>

            <AnimatePresence mode="popLayout">
              {selectedDivision ? (
                <motion.div
                  key={`division-${selectedDivision}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <ChevronRight size={14} className="text-gray-300" />
                  <button
                    onClick={() => handleDivisionChange("")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors text-sm font-bold group"
                  >
                    {CATEGORY_MAP[selectedDivision]}
                    <X
                      size={12}
                      className="text-gray-400 group-hover:text-red-500"
                    />
                  </button>
                </motion.div>
              ) : null}

              {selectedDistrict ? (
                <motion.div
                  key={`district-${selectedDistrict}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <ChevronRight size={14} className="text-gray-300" />
                  <button
                    onClick={() => handleDistrictChange("")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors text-sm font-bold group"
                  >
                    {CATEGORY_MAP[selectedDistrict]}
                    <X
                      size={12}
                      className="text-gray-400 group-hover:text-red-500"
                    />
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Right: Premium Dropdowns */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Division Selector */}
            <div className="relative flex-1 md:flex-none" ref={divRef}>
              <button
                onClick={() => setIsDivOpen(!isDivOpen)}
                className={cn(
                  "w-full md:w-56 flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 border rounded-xl transition-all font-bold text-sm",
                  isDivOpen
                    ? "border-red-500 ring-4 ring-red-50"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <span className="truncate">
                  {selectedDivision
                    ? CATEGORY_MAP[selectedDivision]
                    : "বিভাগ নির্বাচন"}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "text-gray-400 transition-transform",
                    isDivOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {isDivOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-full md:w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden p-2"
                  >
                    <div className="grid grid-cols-1">
                      {divisions.map((div) => (
                        <button
                          key={div}
                          onClick={() => handleDivisionChange(div)}
                          className={cn(
                            "px-4 py-2 text-left text-sm font-bold rounded-lg transition-colors",
                            selectedDivision === div
                              ? "bg-red-50 text-red-600"
                              : "hover:bg-gray-50 text-gray-600",
                          )}
                        >
                          {CATEGORY_MAP[div]}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* District Selector */}
            <div className="relative flex-1 md:flex-none" ref={distRef}>
              <button
                onClick={() => setIsDistOpen(!isDistOpen)}
                disabled={!selectedDivision}
                className={cn(
                  "w-full md:w-64 flex items-center justify-between gap-3 px-4 py-2.5 border rounded-xl transition-all font-bold text-sm",
                  !selectedDivision
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300",
                  isDistOpen && "border-red-500 ring-4 ring-red-50",
                )}
              >
                <span className="truncate">
                  {selectedDistrict
                    ? CATEGORY_MAP[selectedDistrict]
                    : "জেলা নির্বাচন"}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "text-gray-400 transition-transform",
                    isDistOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {isDistOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-full md:w-[320px] bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-50">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="জেলা খুঁজুন..."
                          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:border-red-500 font-bold"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2 grid grid-cols-2 gap-1 custom-scrollbar">
                      {filteredDistricts.map((dist) => (
                        <button
                          key={dist}
                          onClick={() => handleDistrictChange(dist)}
                          className={cn(
                            "px-3 py-1.5 text-left text-xs font-bold rounded-lg transition-colors",
                            selectedDistrict === dist
                              ? "bg-red-50 text-red-600"
                              : "hover:bg-gray-50 text-gray-600",
                          )}
                        >
                          {CATEGORY_MAP[dist]}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
