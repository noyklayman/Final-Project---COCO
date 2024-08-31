import { signOut } from "firebase/auth";
import z from "zod";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Spinner, { useSpinner } from "../../../components/Spinner";
import { auth } from "../../../db";
import { useAuth } from "../../../context/auth.context";
import colors from "../../../colors";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const RegisterFormScheme = z.object({
  name: z.string(),
  email: z.string().email("Email must be a valid email address!"),
  password: z.string(),
  repassword: z.string(),
});

const wait = (time: any) => new Promise((resolve) => setTimeout(resolve, time));
function RegisterPage() {
  const { register, loadingUser: loading } = useAuth();
  const { setLoading } = useSpinner();
  const [fieldErrors, setFieldErrors] = useState({});

  const nav = useNavigate();
  const onRegister = async (e: any) => {
    e.preventDefault();
    const details = Object.fromEntries(new FormData(e.target).entries());

    const parseResult = RegisterFormScheme.safeParse(details);
    if (parseResult.success) {
      const { data: validatedData } = parseResult;

      if (validatedData.password !== validatedData.repassword) {
        return alert("Passwords do not match!");
      }
      (setLoading as any)(true);
      try {
        await (register as any)(details);
        await signOut(auth);
        toast("תודה שנרשמת, מיד תועבר לעמוד התחברות");
        await wait(1500);
        nav("/auth/login");
      } catch (e: any) {
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
      <div className="flex flex-col items-center text-white relative" dir="rtl">
        <form
          onSubmit={onRegister}
          style={{ background: colors.dark }}
          className="grid grid-rows-2 grid-cols-2 gap-4 p-4  m-4 rounded-md min-w-[300px] max-w-[90%]"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-[13px] font-bold p-[2px]">
                שם מלא
              </label>
              <input
                id="name"
                required
                className="border-2 p-2 outline-none rounded-full text-black"
                type="text"
                name="name"
                placeholder="הכנס שם מלא"
              />
              <div className="text-[12px] text-[#bd3333]">{(fieldErrors as any)["name"]}</div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-[13px] font-bold p-[2px]">
                כתובת אימייל
              </label>
              <input
                id="email"
                required
                className="border-2 p-2 outline-none rounded-full text-black"
                type="email"
                name="email"
                placeholder="הכנס אימייל"
              />
              <div className="text-[12px] text-[#bd3333] text-center">
                {(fieldErrors as any)["email"]}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="password" className="text-[13px] font-bold p-[2px]">
                סיסמא
              </label>
              <input
                id="password"
                required
                className="border-2 p-2 outline-none rounded-full text-black"
                type="password"
                name="password"
                placeholder="הכנס סיסמא"
              />
              <div className="text-[12px] text-[#bd3333] text-center">
                {(fieldErrors as any)["password"]}
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="re-password" className="text-[13px] font-bold p-[2px]">
                סיסמא שוב
              </label>
              <input
                id="re-password"
                required
                className="border-2 p-2 outline-none rounded-full text-black"
                type="password"
                name="repassword"
                placeholder="הכנס סיסמא שוב"
              />
              <div className="text-[12px] text-[#bd3333] text-center">
                {(fieldErrors as any)["repassword"]}
              </div>
            </div>
          </div>
       
          <div className="flex flex-col col-span-2 h-[fit-content]">
            <button className="border-[green] bg-[#458645] text-white p-2">הרשם</button>
            <span className="text-center text-[12px] mt-[20px] max-w-[400px]">
              על ידי הרשמה אתה מסכים לתנאי השימוש ולמדיניות הפרטיות שלנו
            </span>
          </div>
          {loading && (
            <div className="w-fit flex items-center justify-center mx-auto absolute bottom-16 left-[calc(50%)] translate-x-[-20px]">
              <Spinner />
            </div>
          )}
          <div
            className="text-[14px] text-[gray]"
            style={{ gridColumn: "span 2", textAlign: "center", color: colors.light }}
          >
            יש לך משתמש?{" "}
            <Link to="/auth/login" className="font-bold">
              הכנס עכשיו
            </Link>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default RegisterPage;
