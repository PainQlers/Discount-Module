import { Card, CardContent } from "@/components/ui/card";

export default function Cart({ items, total }) {
  return (
    <Card className="w-full max-w-3xl mb-6">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">Shopping Cart</h2>
        <div className="border rounded-md divide-y">
          {items.map(item => (
            <div key={item.id} className="flex justify-between p-2">
              <span>{item.name} ({item.category})</span>
              <span> ฿{item.price}</span>
            </div>
          ))}
        </div>
        <div className="text-right font-bold mt-2">Total: ฿{total}</div>
      </CardContent>
    </Card>
  );
}
