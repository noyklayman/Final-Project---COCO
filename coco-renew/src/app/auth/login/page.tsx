import { useEffect, useState } from "react";

import z from "zod";
import { toast, ToastContainer } from "react-toastify";
import Spinner, { useSpinner } from "../../../components/Spinner";
import { useAuth } from "../../../context/auth.context";
import colors from "../../../colors";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const LoginFormScheme = z.object({
  email: z.string().email("Email must be a valid email address!"),
  password: z.string().min(6, "Password must be at least of length 6"),
});
const wait = (time: any) => new Promise((resolve) => setTimeout(resolve, time));
function LoginPage() {
  const { login, loadingUser: loading, user } = useAuth();
  const { setLoading } = useSpinner();

  const router = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});


  useEffect(() => {
    if(user) {
      router("/");
    }
  },[user])
  const onLogin = async (e: any) => {
    e.preventDefault();

    const details = Object.fromEntries(new FormData(e.target).entries());

    const parseResult = LoginFormScheme.safeParse(details);
    if (parseResult.success) {
      const { data: validatedData } = parseResult;
      (setLoading as any)(true);
      try {
        const user = await (login as any)(validatedData);
         toast(`מיד תועבר להתפריט שלנו , ${user.name} היי`);
        await wait(1500);
        router("/menu");
      } catch (e: any) {
        if (e.message.includes("auth/invalid-credential")) {
        toast("פרטי ההתחברות שגויים");
          return;
        }
        if (e.message.includes("auth/user-not-found")) {
          toast("משתמש לא נמצא");
          return;
        }
        if (e.message.includes("auth/wrong-password")) {
          toast("סיסמא שגויה");
          return;
        }

        if (e.message.includes("auth/too-many-requests")) {
        toast("נסה שוב מאוחר יותר");
          return;
        }

         toast(e.message);
      }
      (setLoading as any)(false);
    } else {
      const { errors } = parseResult.error;
      const additionalErrorMap = errors.reduce((prev, next) => {
        (prev as any)[next.path[0]] = next.message;
        return prev;
      }, {});
      setFieldErrors({ ...fieldErrors, ...additionalErrorMap });
    }
  };

  return (
    <div className="p-2 grid place-items-center">
      <div
        className="flex flex-col items-center w-fit mx-auto my-4 text-white"
        dir="rtl"
        style={{ background: colors.dark }}
      >
        <form
          onSubmit={onLogin}
          className="flex flex-col gap-4 p-4  m-4 rounded-md min-w-[300px] max-w-[90%]"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="text-[13px] font-bold p-[2px]">
              כתובת אימייל
            </label>
            <input
              required
              id="email"
              className="text-black border-2 p-2 outline-none rounded-full"
              type="email"
              name="email"
              placeholder="הכנס אימייל"
            />
            <div className="text-[12px] text-[#bd3333]">{(fieldErrors as any)["email"]}</div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-[13px] font-bold p-[2px]">
              סיסמא
            </label>
            <input
              required
              id="password"
              className="text-black border-2 p-2 outline-none rounded-full"
              type="password"
              name="password"
              placeholder="הכנס סיסמא"
            />
            <div className="text-[12px] text-[#bd3333]">{(fieldErrors as any)["password"]}</div>
          </div>

          <div className="grid">
            <button className="border-[green] bg-[#458645] text-white p-2">הכנס</button>
          </div>

          {loading && <Spinner />}
          <div
            className="text-[14px] text-[gray]"
            style={{ gridColumn: "span 2", textAlign: "center", color: colors.light }}
          >
            אין לך משתמש?{" "}
            <Link to="/auth/register" className="font-bold">
              צור אחד עכשיו
            </Link>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default LoginPage;
