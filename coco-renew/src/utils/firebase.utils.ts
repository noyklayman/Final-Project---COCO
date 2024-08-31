import { database } from "../db";
import { get as fbGet, ref } from "firebase/database";

export async function get<T>(url: string) {
  return fbGet(ref(database, url)).then((snapshot) => snapshot.val() as T);
}

export async function getWithKey<T>(url: string) {
  return fbGet(ref(database, url)).then((snapshot) => [snapshot.val() as T, snapshot.key!] as const);
}
