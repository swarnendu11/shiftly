import { useState, useEffect, useRef, useMemo } from "react";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaChevronDown,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";
import { goodsTypeOptions, itemsByType } from "../../utils/goodsData";

// CATEGORY LIMITS stay the same
const CATEGORY_LIMITS = {
  household_small: {
    maxItems: 13,
    maxWeight: 400,
    message:
      "Your items exceed small household limits. Category updated to medium household.",
  },
  household_medium: {
    maxItems: 30,
    maxWeight: 1000,
    message:
      "Your items exceed medium household limits. Category updated to large household.",
  },
  household_large: {
    maxItems: 999,
    maxWeight: 9999,
    message: "",
  },
};

// helper to check household type
const isHouseholdType = (type) => type.includes("household");

const GoodsStep = ({ formData, setFormData, errors }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [warningMessage, setWarningMessage] = useState("");

  // Ensure we always start with a household type
  useEffect(() => {
    if (!formData.goodsType || !isHouseholdType(formData.goodsType)) {
      setFormData((prev) => ({
        ...prev,
        goodsType: "household_small",
        items: prev.items || {},
      }));
    }
  }, []); // run once

  // Available items for current household type
  const availableItems = useMemo(() => {
    return itemsByType[formData.goodsType] || [];
  }, [formData.goodsType]);

  const filteredItems = useMemo(() => {
    return searchQuery
      ? availableItems.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : availableItems;
  }, [searchQuery, availableItems]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Category auto-upgrade logic (still needed for small/medium/large)
  const checkAndUpdateCategory = (items, currentType) => {
    const totalItems = Object.keys(items).length;
    const totalWeight = Object.values(items).reduce(
      (sum, item) => sum + (item.weight || 0) * item.quantity,
      0
    );

    const limit = CATEGORY_LIMITS[currentType];
    let newType = currentType;
    let message = "";

    if (currentType === "household_small") {
      if (totalItems > limit.maxItems || totalWeight > limit.maxWeight) {
        newType = "household_medium";
        message = CATEGORY_LIMITS.household_small.message;
      }
    } else if (currentType === "household_medium") {
      if (totalItems > limit.maxItems || totalWeight > limit.maxWeight) {
        newType = "household_large";
        message = CATEGORY_LIMITS.household_medium.message;
      }
    }

    if (message) {
      setWarningMessage(message);
      setTimeout(() => setWarningMessage(""), 5000);
    }

    return newType;
  };

  const handleItemSelect = (itemData) => {
    const updatedItems = {
      ...formData.items,
      [itemData.id]: {
        name: itemData.name,
        weight: itemData.weight,
        quantity: 1,
      },
    };
    const newType = checkAndUpdateCategory(updatedItems, formData.goodsType);
    setFormData({ ...formData, items: updatedItems, goodsType: newType });
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleQuantityChange = (id, change) => {
    const updatedItems = { ...formData.items };
    const currentQty = updatedItems[id]?.quantity || 0;

    if (currentQty + change <= 0) {
      delete updatedItems[id];
    } else {
      updatedItems[id] = {
        ...updatedItems[id],
        quantity: currentQty + change,
      };
    }

    const newType = checkAndUpdateCategory(updatedItems, formData.goodsType);
    setFormData({ ...formData, items: updatedItems, goodsType: newType });
  };

  // Only household types allowed, so just set directly
  const handleGoodsTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      goodsType: newType,
      items: formData.items,
    });
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleAddCustomItem = () => {
    if (!searchQuery.trim()) return;
    const customItem = {
      id: `custom-${Date.now()}`,
      name: searchQuery,
      isCustom: true,
    };
    handleItemSelect(customItem);
  };

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {warningMessage && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <FaExclamationTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">{warningMessage}</p>
          </div>
        </div>
      )}

      {/* ✅ Household-only Goods Type selector */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Type of Goods</h3>
        <div className="relative">
          <select
            value={formData.goodsType || "household_small"}
            onChange={handleGoodsTypeChange}
            className="w-full p-2.5 pr-10 border rounded-lg appearance-none focus:ring-2 focus:ring-red-500"
          >
            <option value="household_small">Small Household (1-2 rooms)</option>
            <option value="household_medium">Medium Household (2-3 rooms)</option>
            <option value="household_large">Large Household (3+ rooms)</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <FaChevronDown className="text-gray-400 text-sm" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p>
          <span className="font-medium">Household Moving:</span> For moving home
          items, furniture, appliances, and personal belongings.
        </p>
      </div>

      {/* Item Search / Dropdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Items</h3>
        <div className="relative" ref={dropdownRef}>
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onClick={() => {
                setShowDropdown(true);
                if (!searchQuery && availableItems.length > 0) {
                  setSearchQuery("");
                }
              }}
              placeholder="Search or type to add new item..."
              className="w-full p-2.5 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <button
              type="button"
              onClick={handleDropdownClick}
              className="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-gray-600"
            >
              <FaChevronDown
                className={`transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2">
                {(searchQuery ? filteredItems : availableItems).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
                  >
                    <span>{item.name}</span>
                    {item.weight && (
                      <span className="text-sm text-gray-500">
                        {item.weight}kg
                      </span>
                    )}
                  </button>
                ))}
                {searchQuery && filteredItems.length === 0 && (
                  <div className="p-4">
                    <p className="text-gray-600 mb-2">
                      No matching items found.
                    </p>
                    <button
                      onClick={handleAddCustomItem}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      + Add "{searchQuery}" as custom item
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <p className="text-sm text-blue-800 bg-blue-50 p-3 rounded-lg mt-5">
          If you can't find the item you're looking for, type it above and click
          "Add as custom item" to include it in your list.
        </p>
      </div>

      {/* Selected Items */}
      {Object.keys(formData.items).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Selected Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(formData.items).map(([id, item]) => (
              <div
                key={id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.weight && (
                    <p className="text-sm text-gray-500">
                      Weight: {item.weight}kg
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(id, -1)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(id, 1)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaPlus size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const { [id]: _, ...rest } = formData.items;
                      setFormData({ ...formData, items: rest });
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded ml-2"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Items Notes */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Additional Items Note</h3>
        <textarea
          value={formData.additionalItems || ""}
          onChange={(e) =>
            setFormData({ ...formData, additionalItems: e.target.value })
          }
          placeholder="List any extra items not mentioned above..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 resize-y min-h-[100px] max-h-[250px]"
        />
      </div>

      {/* Important Note */}
      <div className="mt-6 bg-red-50 p-4 rounded-lg">
        <p className="text-sm text-red-800">
          <span className="font-semibold">Important:</span> Please list major
          heavy/large items to help the driver prepare for pickup.
        </p>
      </div>

      {errors.items && (
        <div className="mt-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          {errors.items}
        </div>
      )}
    </div>
  );
};

export default GoodsStep;
