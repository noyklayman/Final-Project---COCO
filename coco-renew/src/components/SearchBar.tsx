
import { IconInput } from "./styles";
import colors from "../colors";
import { useOrderContext } from "../context/order.context";
export default function SearchBar() {
  const { search } = useOrderContext();
  return (
    <div
      className="flex flex-row items-center mx-auto bg-white"
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        background: colors.light,
      }}
    >
      <IconInput
        placeholder="חיפוש מנה"
        name="search"
        className=" placeholder:text-[#1f1f1f] placeholder:font-bold w-full" 
        dir="rtl"
        onInput={(e) => {
          search((e.target as any).value);
        }}
      />
      <img src={"https://i.ibb.co/QMGPKtW/search.png"} className="mx-4" height={30} width={20} alt="Mag" />
    </div>
  );
}
