import { useState } from "react";
import { calculateDiscounts } from "../utils/calculateDiscounts";

export function useDiscountCalculator(items, discountTypes) {
    const total = items.reduce((sum, i) => sum + i.price, 0);
  
    const [discounts, setDiscounts] = useState([
      { category: "Coupon", type: "none", params: {} },
      { category: "On Top", type: "none", params: {} },
      { category: "Seasonal", type: "none", params: {} }
    ]);
    
    const [resultPrice, setResultPrice] = useState(null);

    const [errors, setErrors] = useState({});
  
    const handleTypeChange = (index, value) => {
      const newDiscounts = [...discounts];
      newDiscounts[index].type = value;
      newDiscounts[index].params = {};
      setDiscounts(newDiscounts);
      setResultPrice(null); // Reset result when changing discount
      setErrors({});
    };
  
    const handleParamChange = (index, key, value) => {

        const currentDiscount = discounts[index];
        const type = currentDiscount.type;

        if (key === "category") {
            const newDiscounts = [...discounts];
            newDiscounts[index].params[key] = value;
            setDiscounts(newDiscounts);
            setResultPrice(null);
            setErrors({});
            return;
        }

        let numericValue = Number(value);
        if (numericValue < 0) return;

        // ถ้าเป็นส่วนลดแบบ fixed ห้ามเกิน total
    if (type === "fixed" && numericValue > total) {
        numericValue = total;
      }
  
      // ถ้าเป็นเปอร์เซ็นต์ ห้ามเกิน 100%
      if (type === "category" && key === "percent" && numericValue > 100) {
        numericValue = 100;
    }

      if (type === "category" && numericValue > 100) {
        numericValue = 100;
      }
  
      // ถ้าเป็น points ห้ามเกิน 20% ของ total
      if (type === "points" && numericValue > total * 0.2) {
        numericValue = total * 0.2;
      }

      if (type === "specialCampaign" && key === "discount") {
        const every = parseFloat(currentDiscount.params.every) || 300;
        const times = Math.floor(total / every);
        const maxDiscount = total / times; // ส่วนลดสูงสุดต่อครั้งที่ไม่ให้เกินราคาทั้งหมด
        
        if (times > 0 && numericValue * times > total) {
          numericValue = Math.floor(maxDiscount);
        }
      }

        const newDiscounts = [...discounts];
        newDiscounts[index].params[key] = numericValue;
        setDiscounts(newDiscounts);
        setResultPrice(null); // Reset result when changing params
        setErrors({});
    };

    const validateDiscounts = () => {
      const newErrors = {}; // ✅ เปลี่ยนเป็น object
    
      discounts.forEach((discount, index) => {
        if (discount.type && discount.type !== "none") {
          const errorKey = `discount_${index}`; // ✅ สร้าง key
          newErrors[errorKey] = {}; // ✅ สร้าง object ว่างสำหรับแต่ละ discount
    
          switch (discount.type) {
            case "fixed":
              if (!discount.params.amount || discount.params.amount <= 0) {
                newErrors[errorKey].amount = "กรุณากรอกจำนวนเงินส่วนลด"; // ✅ เก็บเป็น object
              }
              break;
            case "percentage":
              if (!discount.params.percentage || discount.params.percentage <= 0) {
                newErrors[errorKey].percentage = "กรุณากรอกเปอร์เซ็นต์ส่วนลด";
              }
              break;
            case "category":
              if (!discount.params.category) {
                newErrors[errorKey].category = "กรุณาเลือก Category";
              }
              if (!discount.params.percent || discount.params.percent <= 0) {
                newErrors[errorKey].percent = "กรุณากรอกเปอร์เซ็นต์ส่วนลด";
              }
              break;
            case "points":
              if (!discount.params.points || discount.params.points <= 0) {
                newErrors[errorKey].points = "กรุณากรอกจำนวน Points";
              }
              break;
            case "specialCampaign":
              if (!discount.params.every || discount.params.every <= 0) {
                newErrors[errorKey].every = "กรุณากรอกจำนวนเงิน Every";
              }
              if (!discount.params.discount || discount.params.discount <= 0) {
                newErrors[errorKey].discount = "กรุณากรอกจำนวนส่วนลด";
              }
              break;
          }
        }
      });
    
      return newErrors; // ✅ return object
    };
  
    const handleApply = () => {
      const validationErrors = validateDiscounts(); // ✅ เปลี่ยนชื่อตัวแปรชั่วคราว
      setErrors(validationErrors); // ✅ set object
      
      const hasErrors = Object.keys(validationErrors).some(
        key => Object.keys(validationErrors[key]).length > 0
      );
      
      if (hasErrors) {
        return;
      }
    
      const final = calculateDiscounts(total, items, discounts, discountTypes);
      setResultPrice(final);
    };
  
    const handleReset = () => {
      setDiscounts([
        { category: "Coupon", type: "none", params: {} },
        { category: "On Top", type: "none", params: {} },
        { category: "Seasonal", type: "none", params: {} }
      ]);
      setResultPrice(null);
      setErrors({});
    };

    // Check if Coupon discount is selected
    const isCouponSelected = discounts[0].type !== "none" && discounts[0].type !== "";
    const isOnTopSelected = discounts[1].type !== "none" && discounts[1].type !== "";

  return {
    total,
    resultPrice,
    handleTypeChange,
    handleParamChange,
    handleApply,
    handleReset,
    isCouponSelected,
    isOnTopSelected,
    discounts,
    errors
  };
}
