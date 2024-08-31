import colors from "../colors";
import { push, ref } from "firebase/database";
import { database } from "../db";
import { useState } from "react";
import { useOrderContext } from "../context/order.context";
import styled from "styled-components";
import QRCode from "react-qr-code";
import { useAuth } from "../context/auth.context";
import { v4 } from "uuid";
const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${colors.dark};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
export default function OrderSummary() {
  const { clearOrder, totalPriceToPay, orderItems, totalItems } = useOrderContext();
  const { user } = useAuth();
  // payment page
  // credit card form etc..
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const [orderType, setOrderType] = useState<"credit" | "cash">("credit");
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as any;
    data.userId = (user as any).uid;
    data.items = orderItems;
    data.totalToPay = totalPriceToPay;
    data.totalItems = totalItems;
    data.date = new Date().toISOString();
    data.id = v4();
    // save to fb
    let total = totalPriceToPay;
    const r = ref(database, "orders");
    // push to firebase
    push(r, data);
    // generate receipt
    // simulate payment
    setLoading(true);
    await wait(5000);
    alert(orderType === "credit" ? "תשלום בוצע בהצלחה" : "הזמנה נשלחה בהצלחה");
    setLoading(false);
    clearOrder();
    setReceipt(
      <div>
        <h1 className="text-[24px] font-bold">קבלה</h1>
        <p>תודה על הזמנתך {data.cardHolder}</p>
        <p>סכום התשלום: {total} ש"ח</p>
        <p className="font-bold">
          {orderType === "cash" ? "אישור הזמנה: " : "אישור תשלום: "} {data.id}
        </p>
        <QRCode className="mx-auto my-4" value={data.id} />
      </div>
    );
  };

  const [receipt, setReceipt] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          background: colors.light,
          width: "90%",
          marginInline: "auto",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
          padding: "1rem",
          display: "flex",
          rowGap: "1rem",
          flexDirection: "column",
          alignItems: "center",
        }}
        dir="rtl"
      >
        <p>{orderType === "credit" ? "תשלום מתבצע.." : "הזמנה נשלחת.."}</p>
        <Spinner />
      </div>
    );
  }
  if (receipt) {
    return (
      <div
        style={{
          background: colors.light,
          width: "90%",
          marginInline: "auto",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
          padding: "1rem",
        }}
        dir="rtl"
      >
        {receipt}
      </div>
    );
  }
  return (
    <div
      dir="rtl"
      style={{
        background: colors.light,
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
      }}
      className="w-[90%] mx-auto p-4"
    >
      <h1
        className="font-bold text-[32px]"
        style={{ borderBottom: `1px solid ${colors.dark}`, marginBottom: "1rem" }}
      >
        צ'ק אווט
      </h1>
      {orderType === "credit" ? (
        <form className="flex flex-col" onSubmit={onSubmit}>
          <label className="font-bold my-1" htmlFor="cardNumber">
            שם בעל הכרטיס
          </label>
          <input
            required
            name="cardHolder"
            type="text"
            style={{ outline: "1px solid lightgray" }}
            id="cardHolder"
            className="p-2 rounded-sm mb-2"
            placeholder="אברהם אבינו"
          />

          <label className="font-bold my-1" htmlFor="cardNumber">
            מספר כרטיס
          </label>
          <input
            name="cardNumber"
            type="text"
            required
            style={{ outline: "1px solid lightgray" }}
            id="cardNumber"
            className="p-2 rounded-sm mb-2"
            placeholder="1234 5678 9101 1121"
          />

          <label className="font-bold my-1" htmlFor="expDate">
            תוקף
          </label>
          <input
            name="expDate"
            type="text"
            id="expDate"
            required
            className="p-2 rounded-sm mb-2"
            style={{ outline: "1px solid lightgray" }}
            placeholder="MM/YY"
          />

          <label className="font-bold my-1" htmlFor="cvv">
            שלוש ספרות בגב הכרטיס
          </label>

          <input
            name="cvv"
            type="text"
            id="cvv"
            required
            style={{ outline: "1px solid lightgray" }}
            className="p-2 rounded-sm"
            placeholder="123"
          />
          <label className="font-bold my-1" htmlFor="cvv">
            טלפון נייד
          </label>
          <input
            name="phone"
            type="text"
            required
            id="phone"
            style={{ outline: "1px solid lightgray" }}
            className="p-2 rounded-sm"
            placeholder="050-1234567"
          />

          <button
            className="mt-4"
            style={{
              background: colors.dark,
              padding: "0.5rem 1rem",
              color: colors.light,
            }}
          >
            בצע תשלום
          </button>
          <button
            className="mt-4"
            onClick={() => setOrderType("cash")}
            style={{
              background: colors.dark,
              padding: "0.5rem 1rem",
              color: colors.light,
            }}
          >
            תשלום במזומן
          </button>
          <div className="mx-auto mt-4">
            <img src={"https://i.ibb.co/MCZ4GGq/cards.png"} alt="cards" height={50} />
          </div>

          <div className="text-center text-[12px]">
            <div className="flex flex-col">
              <span>
                בלחיצה על כפתור התשלום אתה מאשר כי קראת והסכמת לתנאי השימוש ולמדיניות הפרטיות שלנו
              </span>
            </div>
          </div>
        </form>
      ) : (
        <form className="flex flex-col" onSubmit={onSubmit}>
          <label className="font-bold my-1" htmlFor="name">
            שם מלא
          </label>
          <input
            name="name"
            type="text"
            required
            id="name"
            style={{ outline: "1px solid lightgray" }}
            className="p-2 rounded-sm"
            placeholder="אברהם אבינו"
          />
          <label className="font-bold my-1" htmlFor="phone">
            טלפון נייד
          </label>
          <input
            name="phone"
            type="text"
            required
            id="phone"
            style={{ outline: "1px solid lightgray" }}
            className="p-2 rounded-sm"
            placeholder="050-1234567"
          />
          <button
            className="mt-4"
            style={{
              background: colors.dark,
              padding: "0.5rem 1rem",
              color: colors.light,
            }}
          >
            שלח הזמנה
          </button>
          <button
            onClick={() => setOrderType("credit")}
            className="mt-4"
            style={{
              background: colors.dark,
              padding: "0.5rem 1rem",
              color: colors.light,
            }}
          >
            תשלום באשראי
          </button>
        </form>
      )}
    </div>
  );
}
