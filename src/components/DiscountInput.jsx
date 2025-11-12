import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function DiscountInput({ 
  category, 
  discount, 
  discountTypes, 
  onTypeChange, 
  onParamChange, 
  disabled,
  items,
  errors = {}
}) {
  const categoryDiscounts = discountTypes.filter(d => d.category === category);

  return (
    <div className={`border rounded-lg p-4 min-h-[100] w-60 ${disabled ? 'bg-gray-100' : 'bg-white'}`}>
      <h3 className="text-lg font-semibold mb-3">{category} Discount</h3>

      {disabled && discount.type === "none" && category !== "Coupon" && (
        (() => {
          // ตรวจสอบว่า disabled เพราะราคาเหลือ 0 หรือเพราะยังไม่ได้เลือก coupon ก่อนหน้า
          // ถ้า category เป็น "On Top" ให้เช็คว่ามี Coupon ถูกเลือกหรือไม่
          // ถ้า category เป็น "Seasonal" ให้เช็คว่ามี Coupon และ On Top ถูกเลือกหรือไม่
          const shouldShowWarning = category === "On Top" 
            ? disabled && discount.type === "none" // จะแสดงถ้า disabled แต่ต้องมี logic เช็คเพิ่ม
            : category === "Seasonal" 
              ? disabled && discount.type === "none"
              : false;
          
          // อันนี้จะแสดงเฉพาะเมื่อราคาเหลือ 0 จริงๆ เท่านั้น
          // ไม่ใช่ disabled เพราะยังไม่ได้เลือก coupon
          return null; // ปิดการแสดงผลไปก่อน เดี๋ยวเราจะใช้วิธีอื่น
        })()
      )}
      
      <Select 
        value={discount.type || "none"} 
        onValueChange={onTypeChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full mb-2">
          <SelectValue placeholder={`Select ${category} Discount`} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="none">None</SelectItem>
          {categoryDiscounts.map((d) => (
            <SelectItem key={d.key} value={d.key}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {discount.type === "fixed" && (
        <div className="min-h-[80px]">
          <Input 
            type="number" 
            min={0}
            placeholder="Amount (฿)"
            value={discount.params.amount || ""}
            onChange={(e) => onParamChange("amount", e.target.value)}
            className={`mt-2 ${errors.amount ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          )}
        </div>
      )}

      {discount.type === "percentage" && (
        <div>
          <Input 
            type="number" 
            min={0}
            placeholder="Percentage (%)"
            value={discount.params.percentage || ""}
            onChange={(e) => onParamChange("percentage", e.target.value)}
            className={`mt-2 ${errors.percentage ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
          {errors.percentage && (
            <p className="text-red-500 text-xs mt-1">{errors.percentage}</p>
          )}
        </div>
      )}

      {discount.type === "category" && (
        <>
          <div>
            <Select 
              value={discount.params.category || ""} 
              onValueChange={(v) => onParamChange("category", v)}
              disabled={disabled}
            >
              <SelectTrigger className={`w-full mt-2 ${errors.category ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {[...new Set(items.map(i => i.category))].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <Input 
              type="number" 
              min={0}
              placeholder="Discount Percentage (%)"
              value={discount.params.percent || ""}
              onChange={(e) => onParamChange("percent", e.target.value)}
              className={`mt-2 ${errors.percent ? 'border-red-500' : ''}`}
              disabled={disabled}
            />
            {errors.percent && (
              <p className="text-red-500 text-xs mt-1">{errors.percent}</p>
            )}
          </div>
        </>
      )}

      {discount.type === "points" && (
        <div>
          <Input 
            type="number" 
            min={0}
            placeholder="Points (Max 20% of total)"
            value={discount.params.points || ""}
            onChange={(e) => onParamChange("points", e.target.value)}
            className={`mt-2 ${errors.points ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
          {errors.points && (
            <p className="text-red-500 text-xs mt-1">{errors.points}</p>
          )}
        </div>
      )}

      {discount.type === "specialCampaign" && (
        <>
          <div >
            <Input 
              type="number" 
              min={0}
              placeholder="Every (฿)"
              value={discount.params.every || ""}
              onChange={(e) => onParamChange("every", e.target.value)}
              className={`mt-2 ${errors.every ? 'border-red-500' : ''}`}
              disabled={disabled}
            />
            {errors.every && (
              <p className="text-red-500 text-xs mt-1">{errors.every}</p>
            )}
          </div>
          <div>
            <Input 
              type="number" 
              min={0}
              placeholder="Discount Amount (฿)"
              value={discount.params.discount || ""}
              onChange={(e) => onParamChange("discount", e.target.value)}
              className={`mt-2 ${errors.discount ? 'border-red-500' : ''}`}
              disabled={disabled}
            />
            {errors.discount && (
              <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}