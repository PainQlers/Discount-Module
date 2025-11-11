import Cart from "@/components/Cart";
import DiscountInput from "@/components/DiscountInput";
import { useDiscountCalculator } from "@/hooks/useDiscountCalculator";
import { items } from "@/data/items";
import { discountTypes } from "@/data/discountTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DiscountBreakdown from "./components/DiscountBreakdown";

export default function App() {
  const {
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
  } = useDiscountCalculator(items, discountTypes);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">🛍️ Discount Module UI</h1>

      <Cart items={items} total={parseFloat(total).toLocaleString()} />

      <div className="w-full max-w-3xl mb-6 border rounded-lg p-6 bg-white shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Discount Campaigns</h2>
          <Button 
            onClick={handleReset} 
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            Reset All
          </Button>
        </div>

        <div className="flex justify-center gap-5">
          {/* Coupon Discount - Always enabled */}
          <DiscountInput
            category="Coupon"
            discount={discounts[0]}
            discountTypes={discountTypes}
            onTypeChange={(v) => handleTypeChange(0, v)}
            onParamChange={(k, v) => handleParamChange(0, k, v)}
            disabled={false}
            items={items}
            errors={errors.discount_0 || {}}
          />

          {/* On Top Discount - Enabled only if Coupon is selected */}
          <DiscountInput
            category="On Top"
            discount={discounts[1]}
            discountTypes={discountTypes}
            onTypeChange={(v) => handleTypeChange(1, v)}
            onParamChange={(k, v) => handleParamChange(1, k, v)}
            disabled={!isCouponSelected}
            items={items}
            errors={errors.discount_1 || {}}
          />

          {/* Seasonal Discount - Enabled only if On Top is selected */}
          <DiscountInput
            category="Seasonal"
            discount={discounts[2]}
            discountTypes={discountTypes}
            onTypeChange={(v) => handleTypeChange(2, v)}
            onParamChange={(k, v) => handleParamChange(2, k, v)}
            disabled={!isCouponSelected || !isOnTopSelected}
            items={items}
            errors={errors.discount_2 || {}}
          />
        </div>

        <div className="text-center mt-6">
          <Button 
            onClick={handleApply} 
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3"
          >
            Calculate Final Price
          </Button>
        </div>
      </div>

      {resultPrice && (
        <>
        {isCouponSelected && resultPrice.finalPrice !== total && (
          <DiscountBreakdown breakdown={resultPrice.breakdown} />
        )}
          
          <Card className="w-full max-w-3xl bg-green-50 border-green-300 shadow-lg">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold text-green-700">
                🎉 Final Price: {` ฿${parseFloat(resultPrice.finalPrice).toLocaleString()}`}
              </h2>
              <p className="text-lg text-gray-700 mt-2">
                Original cost: <span className="font-semibold"> ฿{parseFloat(total).toLocaleString()}</span> | 
                Total Saved: <span className="font-semibold text-green-600"> ฿{((total - parseFloat(resultPrice.finalPrice)).toFixed(2)).toLocaleString()}</span>
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}