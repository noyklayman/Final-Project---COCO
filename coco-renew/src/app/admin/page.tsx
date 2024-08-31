import colors from "../../colors";
import { useOrderContext } from "../../context/order.context";
import { database } from "../../db";
import { ExtraCategory, MenuItem } from "../../types";
import { get, ref, set } from "firebase/database";
import React, { useEffect, useMemo } from "react";

const AddItemModal = ({
  onClose,
  existingItem,
}: {
  onClose: () => void;
  existingItem: MenuItem | null;
}) => {
  const { categories, setCategories } = useOrderContext();

  // all different extra types for items inside categories

  const [checkedExtras, setCheckedExtras] = React.useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (existingItem) {
      if (existingItem.extras) {
        const extras = existingItem.extras;
        const keys = Object.keys(extras);
        const newExtras = new Map<string, boolean>();
        keys.forEach((key) => {
          newExtras.set(key, true);
        });
        setCheckedExtras(newExtras);
      }
    }
  }, [existingItem]);
  const handleExtraChange = (extraType: string) => {
    setCheckedExtras((prev) => {
      const newExtras = new Map(prev);
      newExtras.set(extraType, !newExtras.get(extraType));
      return newExtras;
    });
  };
  const isExtraChecked = (extraType: string) => {
    return checkedExtras.get(extraType) || false;
  };

  const extraTypes = useMemo(() => {
    const extraTypesMap = new Map();
    
    if (categories && Array.isArray(categories)) {
      categories.forEach((category) => {
        if (category.items && Array.isArray(category.items)) {
          category.items.forEach((item) => {
            if (!item.extras) return;
            
            const keys = Object.keys(item.extras);
            keys.forEach((key) => {
              if (key === "סוג הכוס") return;
              extraTypesMap.set(key, {
                key,
                value: (item.extras as any)[key],
              });
            });
          });
        }
      });
    }
  
    return extraTypesMap;
  }, [categories]);

  const onAddItem = (itemForm: any) => {
    // add item to category

    const name = itemForm.name

    const allItems = categories.map((c) => c.items).flat();
    if (allItems.some((i) => i.name === name && i.name !== existingItem?.name)) {
      alert("קיים פריט בשם זה, אנא בחר שם אחר");
      return;
    }

    const extrasCategory: ExtraCategory = {};
    extraTypes.forEach(({ value }, key) => {
      if (checkedExtras.get(key)) {
        extrasCategory[key] = value;
      }
    });
    const item: MenuItem = {
      name: itemForm.name,
      price: itemForm.price,
      extras: extrasCategory,
      category: itemForm.category,
    };
    // add item to category
    let category = categories.find((category) => category.type === itemForm.category);
    if (!category) {
      throw new Error("Category not found");
    }
    if (existingItem) {
      category.items = category.items.map((i: any) => (i.name === existingItem.name ? item : i));
    } else {
      category.items.push(item);
    }
    const categoryReference = ref(database, `items_coco_car/${category.type}`);
    set(categoryReference, category.items);
    // cache local storage
    localStorage.setItem("items_coco_car_1", JSON.stringify(categories));
    setCategories(
      [...categories.map((c) => (c.type !== itemForm.category ? c : category))].sort((a, b) =>
        a.type.localeCompare(b.type)
      )
    );

    alert(existingItem ? "הפריט עודכן בהצלחה" : "הפריט נוסף בהצלחה");
  };

  return (
    <div
      dir="rtl"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAddItem(Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()));
        }}
        style={{
          background: "white",
          minWidth: "min(80%, 400px)",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          borderRadius: "4px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            marginBottom: "1rem",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {existingItem ? `עריכת פריט - ${existingItem.name}` : "הוספת פריט חדש"}
        </h2>
        <input
          type="text"
          defaultValue={existingItem?.name}
          name="name"
          placeholder="שם הפריט"
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            marginBottom: "1rem",
          }}
        />
        <input
          name="price"
          type="text"
          defaultValue={existingItem?.price}
          placeholder="מחיר"
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            marginBottom: "1rem",
          }}
        />

        <select
          name="category"
          defaultValue={existingItem?.category}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            marginBottom: "1rem",
          }}
        >
          {[
            <option key={"catDefault"} disabled>
              בחר קטגוריה
            </option>,
            ...categories.map((category) => (
              <option key={category.type} value={category.type}>
                {category.type}
              </option>
            )),
          ]}
        </select>
        <br />
        <h3
          style={{
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          אופציות נוספות
        </h3>
        <div
          style={{
            display: "grid",
            width: "100%",
            alignContent: "center",
            gridTemplateColumns: "1fr 1fr 1fr",
          }}
        >
          {Array.from(extraTypes.keys()).map((extraType) => (
            <div
              style={{
                width: "100%",
              }}
              key={extraType}
            >
              <h3>{extraType}</h3>
              <input
                type="checkbox"
                name={extraType}
                defaultChecked={existingItem?.extras?.hasOwnProperty(extraType)}
                checked={isExtraChecked(extraType)}
                onChange={() => handleExtraChange(extraType)}
                placeholder="שם האופציה"
                style={{
                  width: "1rem",
                  height: "1rem",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  marginBottom: "1rem",
                }}
              />
            </div>
          ))}
        </div>
        <br />
        <button
          style={{
            background: colors.main,
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {existingItem ? "שמור שינוים" : "הוסף פריט"}
        </button>
        <button
          style={{
            background: colors.light,
            color: "black",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
          onClick={onClose}
        >
          ביטול
        </button>
      </form>
    </div>
  );
};

export default function AdminPage() {
  const { categories, setCategories } = useOrderContext();
  const [showingModal, setShowingModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MenuItem | null>(null);
  const [orders, setOrders] = React.useState<any[]>([]);
  const getAllOrders = async () => {
    // get all orders
    const r = ref(database, "orders");
    const snapshot = await get(r);
    if (snapshot.exists()) {
      return { ...snapshot.val(), id: snapshot.key };
    } else {
      console.log("No data available");
      return [];
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getAllOrders();
        setOrders(Object.values(orders));
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrders();
  }, []);
  const onDeleteItem = (item: MenuItem) => {
    // delete item from category
    let category = categories.find((category) => category.type === item.category);
    if (!category) {
      throw new Error("Category not found");
    }
    category.items = category.items.filter((i: any) => i.name !== item.name);
    const categoryReference = ref(database, `items_coco_car/${category.type}`);
    set(categoryReference, category.items);
    // cache local storage
    localStorage.setItem("items_coco_car_1", JSON.stringify(categories));
    setCategories(
      categories
        .map((c) => (c.type !== item.category ? c : category))
        .sort((a, b) => a.type.localeCompare(b.type))
    );
    alert("הפריט נמחק בהצלחה");
  };
  if (showingModal) {
    return (
      <AddItemModal
        existingItem={editingItem}
        onClose={() => {
          setShowingModal(false);
          setEditingItem(null);
        }}
      />
    );
  }

  return (
    <div className="h-[100vh] p-4">
      <div dir="rtl">
        <div
          style={{
            background: colors.light,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
          }}
        >
          <h2>ניהול תפריט</h2>
          <br />
          <button
            onClick={() => {
              // show modal
              setShowingModal(true);
            }}
            style={{
              background: colors.main,
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            הוספת פריט
          </button>

          <br />
          <br />

          <h1>תפריט</h1>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2 border-[1px] border-[lightgray] p-2 m-2 ">
            {categories.map((category) => (
              <div key={category.type} className="h-full p-2">
                <h2 className="font-bold text-[20px]">{category.type}</h2>
                <div className="grid md:grid-cols-2 sm:grid-cols-1  border-b-[1px] pb-2">
                  {category.items.map((item: any) => (
                    <div key={item.name} className="py-2">
                      <h3 className="py-[4px]">
                        {item.name} - {item.price}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onDeleteItem(item)}
                          style={{
                            background: "#bd3333",
                            color: "white",
                            padding: "0.5rem 1rem",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          מחיקה
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowingModal(true);
                          }}
                          style={{
                            background: colors.main,
                            color: "white",
                            padding: "0.5rem 1rem",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          עריכה
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <h1>
          <div className="pb-4">
            הזמנות
            <br />
            <br />
            {
              // show orders
              orders
                .filter((o) => o.cardHolder)
                .map((order) => (
                  <div key={order.id} className="border-[1px] border-[lightgray] p-2 m-2">
                    <h2 className="font-bold text-[20px]">הזמנה {order.id}</h2>
                    <div>
                      <div>
                        <b>שם:</b> {order.cardHolder}
                      </div>
                      <div>
                        <b>טלפון נייד</b> {order.phone}
                      </div>

                      <div dir="rtl">
                        <b>תאריך</b>{" "}
                        {new Date(order.date).toLocaleDateString("he-IL") +
                          "  " +
                          new Date(order.date).toLocaleTimeString("he-IL")}
                      </div>
                    </div>
                    <br />
                    <div>
                      <b>פריטים בהזמנה</b>
                    </div>
                    <div className="grid grid-cols-1  border-b-[1px] pb-2">
                      {order.items?.map((item: any) => (
                        <div
                          className="flex justify-between flex-col border-[1px] border-[#3e3e3e] my-2 p-2 min-w-[200px]"
                          key={item.item.name + item.item.price}
                        >
                          <div className="flex justify-between">
                            <span>
                              <b>
                                {item.item.name}{" "}
                                <span dir="ltr">
                                  <span className="text-[12px] font-normal">
                                    {item.quantity} <span>x</span>{" "}
                                  </span>
                                </span>
                              </b>
                            </span>
                            <span>{item.item.price} ש"ח</span>
                          </div>

                          {item.selectedExtras && (
                            <div className="my-2">
                              {Object.entries(item.selectedExtras).map(([key, value]) => (
                                <div className="flex justify-between">
                                  <span>
                                    <b>{key}</b>
                                  </span>
                                  <span>{(value as any).join(", ")}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            }
          </div>
        </h1>
      </div>
    </div>
  );
}
