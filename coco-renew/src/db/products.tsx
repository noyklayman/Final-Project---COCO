import { MenuCategory, MenuItem } from "../types";
import { get } from "../utils/firebase.utils";

export async function getProducts(): Promise<MenuCategory[]> {
  return get<{ [id: string]: MenuItem[] }>("items_coco_car").then((categoryObject) => {
    return Object.entries(categoryObject).map(([category, value]) => {
      return {
        type: category,
        items: value.map((item) => {
          item.category = category;
          return item;
        }),
      } as MenuCategory;
    });
  });
}
