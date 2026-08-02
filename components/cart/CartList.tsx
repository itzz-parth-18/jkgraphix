import CartItem from "./CartItem";

type Props = {
  items: any[];
  onIncrease: (itemId: string, quantity: number) => void;
  onDecrease: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
};

export default function CartList({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={() =>
            onIncrease(item.id, item.quantity)
          }
          onDecrease={() =>
            onDecrease(item.id, item.quantity)
          }
          onRemove={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
}