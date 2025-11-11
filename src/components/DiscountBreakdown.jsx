import { Card, CardContent } from "@/components/ui/card";

export default function DiscountBreakdown({ breakdown }) {
    return (
      <Card className="w-full max-w-3xl mb-6 bg-blue-50 border-blue-300">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">💰 Discount Breakdown</h2>
          
          {breakdown.map((step, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {index + 1}. {step.category} - {step.details.type}
                </h3>
                <span className="text-lg font-bold text-red-600">
                  - ฿{parseFloat(step.discountAmount).toLocaleString()} 
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                <div className="flex justify-between">
                  <span>Price before discount:</span>
                  <span className="font-semibold">฿{parseFloat(step.beforePrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price after discount:</span>
                  <span className="font-semibold text-green-600">฿{parseFloat(step.afterPrice).toLocaleString()}</span>
                </div>
              </div>
  
              {/* Details based on discount type */}
              {step.details.type === "Fixed Amount" && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  Fixed discount: ฿{parseFloat(step.details.amount).toLocaleString()}
                </div>
              )}
  
              {step.details.type === "Percentage Discount" && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  Discount: {parseFloat(step.details.percentage).toLocaleString()}%
                </div>
              )}
  
              {step.details.type === "Category Discount" && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <div className="font-semibold mb-1">
                    Category: {step.details.category} ({step.details.percentage}% off)
                  </div>
                  <div className="space-y-1">
                    {step.details.items.map((item, i) => (
                      <div key={i} className="flex justify-between pl-2">
                        <span>• {item.name}: ฿{parseFloat(item.price).toLocaleString()}</span>
                        <span className="text-red-600">-฿{parseFloat(item.discount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
  
              {step.details.type === "Points Discount" && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  Points used: {parseFloat(step.details.points).toLocaleString()} (Max 20% of total)
                  {step.details.points !== step.details.actualDiscount && (
                    <div className="text-xs text-orange-600 mt-1">
                      Capped at ฿{step.details.actualDiscount}
                    </div>
                  )}
                </div>
              )}
  
              {step.details.type === "Special Campaign" && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  Every ฿{parseFloat(step.details.every).toLocaleString()} → ฿{parseFloat(step.details.discountPerTier).toLocaleString()} discount
                  <div className="mt-1">Qualified {step.details.times} time(s)</div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }