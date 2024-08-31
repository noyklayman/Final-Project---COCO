import { MenuContainer } from "./styles";
import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router";

export default () => {
  const nav = useNavigate();
  const { user,logout } = useAuth();

  return (
    <MenuContainer className={` absolute bottom-0 right-0 top-0 p-4`}>
      <div className="relative w-full h-full">
        <img
          alt="No logo"
          width={200}
          height={100}
          className="image absolute bottom-[380px]"
          src={
            "https://firebasestorage.googleapis.com/v0/b/tabitorderprd.appspot.com/o/td-brand-v2%2F63e0f6d7ef3221b153e413f5%2Fthumbnail_%D7%9C%D7%95%D7%92%D7%95%20%D7%A9%D7%97%D7%95%D7%A8.png?alt=media&token=dfe6a43c-0317-4320-a155-3cb8f25eb003"
          }
        />
        <div
          className={`menu absolute bottom-44 rounded-md border-[1px] border-[black] bg-[#E4B6A7] w-[55px] min-h-[45px] p-2 text-center center center-2`}
        ></div>

        {user && (
          <span
          className={`text-[24px] flex flex-col items-center font-bold translate-x-[2.25rem] absolute bottom-60 rounded-md border-[black]  min-h-[60px] p-2 text-center center`}
          >
            <span className="mb-1">{(user as any)?.name} שלום</span>
            <span className="text-[16px] font-normal translate-y-[-.325rem] cursor-pointer" onClick={() => {
              const conf = confirm("האם אתה בטוח שברצונך להתנתק?");
              if (conf) {
                (logout as any)();
              }
            }}>
              התנתק
            </span>
          </span>
        )}
        <div
          onClick={() => {
            if (!user) {
              nav("/auth/login");
              return;
            }
            nav("/menu");
          }}
          className={`menu absolute bottom-44 rounded-md border-[1px] border-[black] bg-[#E4B6A7] w-[60px] min-h-[60px] p-2 text-center center`}
        >
          לצפייה בתפריט
        </div>
        <div
          className={`menu absolute bottom-24 right-0 rounded-full border-[1px] border-[black] min-h-[60px] p-2 btn text-center`}
        >
          <span
            className="text"
            onClick={() => {
              if (!user) {
                nav("/auth/login");
                return;
              }
              nav("/menu");
            }}
          >
            {" "}
            הזמן ושב
          </span>
        </div>
        {user && (user as any).isAdmin && <div
          className={`menu absolute bottom-5 right-0 rounded-full border-[1px] border-[black] min-h-[20px] p-2 btn text-center`}
        >
          <span
            className="text"
            onClick={() => {
              nav("/admin");
            }}
          >
            {" "}
             עמוד ניהול
          </span>
        </div>}
      </div>
    </MenuContainer>
  );
};
