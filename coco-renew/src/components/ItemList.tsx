import { useOrderContext } from "../context/order.context";
import React from "react";
import { ItemListContainer } from "./styles";
import { useExtrasModalContext } from "../context/modal.context";



export default function ItemList() {
  const { selectedCategory } = useOrderContext();
  const { setOpen } = useExtrasModalContext();
  if (!selectedCategory) return null;

  return (
    <ItemListContainer>
      {React.Children.toArray(
        selectedCategory.items.map((item) => (
          <div className="item-card" onClick={() => setOpen(item)}>
            {item.name} - {item.price}
            <span className="self-end text-[12px]">{item.category}</span>
          </div>
        ))
      )}
    </ItemListContainer>
  );
}
