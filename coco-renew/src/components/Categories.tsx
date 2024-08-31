import { MenuCategory } from "../types";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CategoriesBar, SelectedItem } from "./styles";
import { useOrderContext } from "../context/order.context";
import { v4 } from "uuid";

export default function Categories({ categories }: { categories: MenuCategory[] }) {
  const names = useMemo(() => categories.map((c) => c.type), [categories]);
  const { setSelectedCategory, selectedCategory } = useOrderContext();
  const [selection, setSelection] = useState(names[0]);
  useEffect(() => {
    if (selectedCategory) setSelection(selectedCategory.type);
  }, [selectedCategory]);

  const barRef = useRef<HTMLDivElement | null>(null);

  const onItemClicked = (name: string, index: number) => {
    setSelection(name);
    setSelectedCategory(categories[index]);
    if (index === 2) {
      return;
    }
    if (index > 2) {
      barRef.current?.scrollTo(300, 0);
    } else {
      barRef.current?.scrollTo(0, 0);
    }
  };
  const toUpperCase = useCallback(function (name: string) {
    return name[0].toUpperCase() + name.slice(1);
  }, []);
  return (
    <CategoriesBar ref={barRef}>
      {React.Children.toArray(
        names.map((name, index) =>
          selection === name ? (
            <SelectedItem key={v4()} onClick={() => onItemClicked(name, index)}>
              {toUpperCase(name)}
            </SelectedItem>
          ) : (
            <p onClick={() => onItemClicked(name, index)} style={{}}>
              {toUpperCase(name)}
            </p>
          )
        )
      )}
    </CategoriesBar>
  );
}
