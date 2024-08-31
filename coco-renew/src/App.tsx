import { ExtrasModalContextProvider } from "./context/modal.context";

import { SpinnerProvier } from "./components/Spinner";
import { OrderContextProvider } from "./context/order.context";
import {  useAuth } from "./context/auth.context";
import {  Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./app/page";
import LoginPage from "./app/auth/login/page";
import RegisterPage from "./app/auth/register/page";
import MenuPage from "./app/menu/page";
import AdminPage from "./app/admin/page";
import colors from "./colors";

export default function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const nav = useNavigate();

  return (
    <div>
      <ExtrasModalContextProvider>
        <SpinnerProvier>
          <OrderContextProvider>
            {user && (user as any).isAdmin && (
              <div
                className="w-full p-2 cursor-pointer z-[9999]"
                dir="ltr"
                style={{ background: colors.dark }}
              >
                <div>
                  {pathname.includes("/admin") ? (
                    <span
                    onClick={() => nav("/")}
                    className="text-white">חזור לדף בית</span>
                  ) : (
                    <span
                      onClick={() => {
                        nav("/admin");
                      }}
                      className="text-white"
                    >
                      ניהול תפריט והזמנות
                    </span>
                  )}
                </div>
              </div>
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/menu" element={<MenuPage />} />
            </Routes>
          </OrderContextProvider>
        </SpinnerProvier>
      </ExtrasModalContextProvider>
    </div>
  );
}
