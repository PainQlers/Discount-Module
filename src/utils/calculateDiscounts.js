export function calculateDiscounts(total, items, discounts, discountTypes) {
  let currentPrice = total;
  const breakdown = [];

  const orderedDiscounts = [...discounts]
    .filter(d => d.type && d.type !== "none")
    .sort((a, b) => {
      const categoryOrder = { "Coupon": 1, "On Top": 2, "Seasonal": 3 };
      const catA = discountTypes.find(d => d.key === a.type)?.category;
      const catB = discountTypes.find(d => d.key === b.type)?.category;
      return (categoryOrder[catA] || 99) - (categoryOrder[catB] || 99);
    });

  orderedDiscounts.forEach((discount) => {
    if (currentPrice <= 0) {
      return;
    }

    const beforePrice = currentPrice;
    let discountAmount = 0;
    let details = {};

    switch (discount.type) {
      case "fixed": {
        const fixedAmount = parseFloat(discount.params.amount) || 0;
        discountAmount = Math.min(fixedAmount, currentPrice);
        currentPrice = Math.max(0, currentPrice - fixedAmount);
        details = { 
          type: "Fixed Amount",
          amount: fixedAmount 
        };
        break;
      }
      case "percentage": {
        const percentage = parseFloat(discount.params.percentage) || 0;
        discountAmount = currentPrice * (percentage / 100);
        currentPrice = currentPrice * (1 - percentage / 100);
        details = { 
          type: "Percentage Discount",
          percentage: percentage 
        };
        break;
      }
      case "category": {
        const targetCategory = discount.params.category;
        const categoryPercent = parseFloat(discount.params.percent) || 0;
        const categoryItems = items.filter(item => item.category === targetCategory);
        const categoryTotal = categoryItems.reduce((sum, item) => sum + item.price, 0);
        discountAmount = categoryTotal * categoryPercent / 100;
        currentPrice = Math.max(0, currentPrice - discountAmount);
        details = { 
          type: "Category Discount",
          category: targetCategory,
          percentage: categoryPercent,
          items: categoryItems.map(item => ({
            name: item.name,
            price: item.price,
            discount: (item.price * categoryPercent / 100).toFixed(2)
          }))
        };
        break;
      }
      case "points": {
        const points = parseFloat(discount.params.points) || 0;
        const maxPointsDiscount = total * 0.2;
        discountAmount = Math.min(points, maxPointsDiscount);
        currentPrice = Math.max(0, currentPrice - discountAmount);
        details = { 
          type: "Points Discount",
          points: points,
          actualDiscount: discountAmount
        };
        break;
      }
      case "specialCampaign": {
        const every = parseFloat(discount.params.every) || 300;
        const discountPerTier = parseFloat(discount.params.discount) || 40;
        const times = Math.floor(total / every);
        discountAmount = times * discountPerTier;
        currentPrice = Math.max(0, currentPrice - discountAmount);
        details = { 
          type: "Special Campaign",
          every: every,
          discountPerTier: discountPerTier,
          times: times
        };
        break;
      }
      default:
        break;
    }

    if (discountAmount > 0) {
      breakdown.push({
        category: discount.category,
        beforePrice: beforePrice.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        afterPrice: currentPrice.toFixed(2),
        details: details
      });
    }
  });

  return {
    finalPrice: currentPrice.toFixed(2),
    breakdown: breakdown
  };
}