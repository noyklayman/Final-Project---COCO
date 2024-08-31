export function tranlsateCategory(category: string) {
  switch (category) {
    case "coffee":
      return "קפה";
    case "special drinks":
      return "שתייה מיוחדת";
    case "cold drinks":
      return "שתייה קרה";
    case "iced coffees":
      return "קפה קר";
    case "cold brew":
      return "קולד ברו";
  }
  return category;
}
