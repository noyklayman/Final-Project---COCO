import { useNavigate } from "react-router";
import colors from "../../colors";
import Categories from "../../components/Categories";
import ItemList from "../../components/ItemList";
import OrderDetails from "../../components/OrderDetails";
import OrderSummary from "../../components/OrderSummary";
import SearchBar from "../../components/SearchBar";
import Extras from "../../components/extras/Extras";
import { CategoriesBarContainer } from "../../components/styles";
import { useAuth } from "../../context/auth.context";
import { useOrderContext } from "../../context/order.context";
import  { useEffect } from "react";

export default function MenuPage() {
  const { categories, orderSummary, setOrderSummary } = useOrderContext();
  const router = useNavigate();
  const { logout, user } = useAuth();
  useEffect(() => {
    if (!user) {
      router("/auth/login");
    }
  }, [user]);
  return (
    <div className="md:grid md:grid-cols-2 mx-auto items-start  md:mt-[32px] justify-items-center">
      <div>
        {!orderSummary && <SearchBar />}
        <OrderDetails />
        <div
          style={{ background: colors.light }}
          className="mb-4 flex justify-center items-center flex-col"
        >
          <div
            className="cursor-pointer p-2"
            onClick={() => {
              if (orderSummary) {
                setOrderSummary(false);
                return;
              }
              router("/");
            }}
          >
            {orderSummary ? "חזור לתפריט הראשי" : "בחזרה לדף הבית"}
          </div>
          <hr className="border-1 border-[lightgray] w-full" />
          <div
            className="cursor-pointer bg-[rgba(0,0,0,0.8)] w-full h-full text-white text-center p-2"
            onClick={() => {
              const conf = confirm("האם אתה בטוח שברצונך להתנתק?");
              if (conf) {
                (logout as any)();
              }
            }}
          >
            התנתק
          </div>
        </div>
      </div>

      {orderSummary ? (
        <OrderSummary />
      ) : (
        <CategoriesBarContainer>
          <Categories categories={categories} />
          <ItemList />
        </CategoriesBarContainer>
      )}

      <Extras />
    </div>
  );
}
