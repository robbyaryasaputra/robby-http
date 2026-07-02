import { createRoot } from "react-dom/client";
import "./tailwind.css";
import RestaurantExplorer from "./RestaurantExplorer";

createRoot(document.getElementById("root")).render(
  <div>
    <RestaurantExplorer />
  </div>
);
