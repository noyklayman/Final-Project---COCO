export type CupType = "זכוכית" | "TA";
export type MilkSide = "חלב חם" | "חלב קר" | "ללא חלב";
export type MilkType = "חלב סויה" | "חלב שיבולת שועל" | "חלב רגיל" | "חלב דל" | "חלב שקדים";
export type CoffeeStrength = "חלש" | "חזק" | "רגיל";
export type IceMintLemon = "עם קרח" | "עם נענע" | "עם לימון";
export type TeaMint = "עם נענע" | "בלי נענע";
export type CoffeeModifications =
  | "מפורק"
  | "בסיס מים"
  | "נטול"
  | "בלי קצף"
  | "הרבה קצף"
  | "חזק"
  | "חלש"
  | "פושר"
  | "רותח"
  | "ללא שינויים";

export type ExtraOptions =
  | CupType
  | MilkSide
  | MilkType
  | CoffeeStrength
  | IceMintLemon
  | TeaMint
  | CoffeeModifications;

export type ExtraCategory = {
  [category: string]: ExtraOptions[];
};

export const extrasTypeOptions = {
  "סוג חלב": false,
  חוזק: false,
  כוס: true,
  בצד: true,
  "סוג כוס": false,
  נענע: false,
  "שינויים לקפה": true,
} as const;

export const flippableOptions: Record<string, [string, string][]> = {
  "שינויים לקפה": [
    ["חזק", "חלש"],
    ["בלי קצף", "הרבה קצף"],
    ["פושר", "רותח"],
  ],
} as const;
export const coupledOptions: Record<string, [string, string][]> = {
  בצד: [["חלב קר בצד", "חלב חם בצד"]],
};
export type ExtrasTypeOptionsKey = keyof typeof extrasTypeOptions;

export type MenuItem = {
  name: string;
  price: string;
  category: string;
  extras?: ExtraCategory;
};

export type OrderItem = {
  item: MenuItem;
  id: string;
  quantity: number;
  selectedExtras: ExtraCategory;
};

export type MenuCategory = {
  type: string;
  items: MenuItem[];
};

export type CoffeeShopMenu = {
  items_coco_car: MenuCategory[];
};
