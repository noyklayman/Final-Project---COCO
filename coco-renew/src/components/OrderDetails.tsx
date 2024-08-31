import colors from "../colors";
import { useAuth } from "../context/auth.context";
import { useOrderContext } from "../context/order.context";
import {  useAnimate } from "framer-motion";
import React, { useEffect } from "react";

export default function OrderDetails() {
  const {
    orderItems,
    totalItems,
    totalPriceToPay,
    setOrderSummary,
    orderSummary,
    updateOrderItem,
  } = useOrderContext();
  const [scope, animate] = useAnimate();
  const [scopeItemsInOrder, animateItemsInOrder] = useAnimate();
  useEffect(() => {
    const animation = async () => {
      await animate(scope.current, {
        scale: [0, 1],
        transition: { duration: 0.5 },
      });
    };
    animation();
  }, [totalPriceToPay]);
  useEffect(() => {
    const animation = async () => {
      await animateItemsInOrder(scopeItemsInOrder.current, {
        scale: [0, 1],
        transition: { duration: 0.5 },
      });
    };
    animation();
  }, [totalItems]);
  const {user} = useAuth()
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <div
      className="flex flex-col w-full mx-auto p-4 min-w-[300px]"
      style={{ background: colors.dark, color: colors.light }}
    >
      <span className="text-end  mb-1">{(user as any)?.name} שלום</span>
      <span className="text-end font-bold mb-1">סיכום הזמנה</span>
      <div className="flex flex-col justify-between" dir="rtl">
        <div className="flex flex-row items-center gap-1">
          <div ref={scopeItemsInOrder}>{totalItems}</div>
          <span> פריטים בהזמנה </span>
        </div>
        <div className="flex flex-row items-center gap-1">
          <span> מחיר כולל: </span>
          <div ref={scope}>{totalPriceToPay} ש"ח</div>
        </div>
      </div>

      <button
        className="text-[white] mt-2 p-2"
        style={{ background: "#5C4033", border: `1px solid ${colors.light}` }}
        onClick={() => setModalShow(true)}
      >
        פרטי הזמנה
      </button>
      {!orderSummary && (
        <button
          className="text-[white] mt-2 p-2"
          style={{ background: "#5C4033", border: `1px solid ${colors.light}` }}
          onClick={() =>  {
            if(orderItems.length === 0) {
              alert("אנא בחר מוצרים להזמנה")
              return
            }
            setOrderSummary(true)
          }}
        >
          מעבר לתשלום
        </button>
      )}

      {modalShow && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          dir="rtl"
        >
          <div className="p-4 rounded-lg w-[300px]" style={{ background: colors.dark }}>
            <span className="text-xl font-bold">פרטי הזמנה</span>
            <div className="flex flex-col max-h-[400px] overflow-y-scroll no-scrollbar cursor-all-scroll">
              {orderItems.map((item) => (
                <div
                  className="flex justify-between flex-col border-[1px] border-[#3e3e3e] my-2 p-2"
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

                  <div className="my-2">
                    {Object.entries(item.selectedExtras).map(([key, value]) => (
                      <div className="flex justify-between">
                        <span>
                          <b>{key}</b>
                        </span>
                        <span>{value.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-row items-center justify-between text-[12px]">
                    <button
                      onClick={() => {
                        item.quantity -= 1;
                        updateOrderItem(item);
                      }}
                    >
                      הסר אחד
                    </button>
                    <button
                      onClick={() => {
                        item.quantity = 0;
                        updateOrderItem(item);
                      }}
                    >
                      הסר הכל
                    </button>
                    <button
                      onClick={() => {
                        item.quantity += 1;
                        updateOrderItem(item);
                      }}
                    >
                      הוסף עוד
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <span>סה"כ</span>
              <span>{totalPriceToPay} ש"ח</span>
            </div>

            <button
              style={{ background: colors.light, color: colors.dark }}
              className="rounded-md px-2 mt-4 block mr-auto"
              onClick={() => setModalShow(false)}
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
