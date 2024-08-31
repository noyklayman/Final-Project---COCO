import { getProducts } from "../db/products";
import { MenuCategory, MenuItem, OrderItem } from "../types";
import { tranlsateCategory } from "../utils/translation.utils";
import React, { createContext, useEffect, useMemo, useState } from "react";
export interface IOrderContext {
  chosenItems: { item: MenuItem; quantity: number; options: any }[];
  addItem: (item: MenuItem, quantity: number, options: any) => void;
  selectedCategory: MenuCategory | null;
  addOrderItem: (item: OrderItem) => void;
  clearOrder: () => void;
  updateOrderItem: (item: OrderItem) => void;
  orderItems: OrderItem[];
  setCategories: (categories: MenuCategory[]) => void;
  categories: MenuCategory[];
  setSelectedCategory: (category: MenuCategory | null) => void;
  search: (query: string) => void;
  orderSummary: boolean;
  setOrderSummary: (value: boolean) => void;
  totalItems: number;
  totalPriceToPay: number;
  removeItem: (item: MenuItem) => void;
}

const OrderContext = createContext<IOrderContext | null>(null);

export function OrderContextProvider(props: { children: React.ReactNode }) {
  const [chosenItems, setChosenItems] = React.useState<
    { item: MenuItem; quantity: number; options: any }[]
  >([]);
  const [query, setQuery] = useState("");

  const clearOrder = () => {
    setChosenItems([]);
    setOrderItems([]);
  };

  const [orderSummary, setOrderSummary] = React.useState(false);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [categories, setCategories] = React.useState<MenuCategory[]>([]);

  const updateOrderItem = (item: OrderItem) => {
    if (item.quantity === 0) {
      const newItems = orderItems.filter((i) => i.id !== item.id);
      setOrderItems(newItems);
      return;
    }
    const newItems = orderItems.map((i) => {
      if (i.id === item.id) {
        return { ...item };
      }
      return i;
    });
    setOrderItems(newItems);
  };

  const totalPriceToPay = useMemo(() => {
    return orderItems.reduce((acc, item) => {
      return acc + parseFloat(item.item.price) * item.quantity;
    }, 0);
  }, [orderItems]);

  const totalItems = useMemo(() => {
    return orderItems.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  }, [orderItems]);

  const addOrderItem = (item: OrderItem) => {
    setOrderItems([...orderItems, item]);
  };

  async function fetchCategories() {
    let items: MenuCategory[];
    try {
      let cacheFileName = "items_coco_car_1";
      const cache = localStorage.getItem(cacheFileName);
      if (cache) {
        items = JSON.parse(cache) as MenuCategory[];
      } else {
        items = await getProducts();
        localStorage.setItem(cacheFileName, JSON.stringify(items));
      }
      items = items.map((item) => {
        item.items = item.items.map((i) => {
          return { ...i, category: item.type };
        });
        item.type = tranlsateCategory(item.type);
        return item;
      });
    } catch (e) {
      console.log(e);
      items = [];
    }
    setCategories(items.sort((a, b) => a.type.localeCompare(b.type)));
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (query) {
      // find items that match the query, create a new category with those and make it the selected category
      const items = categories.flatMap((c) => c.items);
      const matchingItems = items.filter((i) => i.name.includes(query));
      const newCategory: MenuCategory = { type: "search", items: matchingItems };
      setSelectedCategory(newCategory);
    } else if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [query, categories]);

  const [selectedCategory, setSelectedCategory] = React.useState<MenuCategory | null>(null);

  const addItem = (item: MenuItem, quantity: number, options: any) => {
    const newItems = [...chosenItems];
    const existingItem = newItems.find((i) => i.item.name === item.name);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      newItems.push({ item, quantity, options });
    }
    setChosenItems(newItems);
  };

  const removeItem = (item: MenuItem) => {
    const newItems = chosenItems.filter((i) => i.item.name !== item.name);
    setChosenItems(newItems);
  };

  return (
    <OrderContext.Provider
      value={{
        chosenItems,
        orderItems,
        setCategories,
        addItem,
        updateOrderItem,
        addOrderItem,
        removeItem,
        selectedCategory,
        setSelectedCategory,
        categories,
        totalItems,
        clearOrder,
        totalPriceToPay,
        orderSummary,
        setOrderSummary,
        search: setQuery,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within a OrderContextProvider");
  }
  return context;
}
