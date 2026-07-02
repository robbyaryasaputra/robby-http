import { createRoot } from "react-dom/client";
import './tailwind.css';
import UserForm from "./UserForm";

createRoot(document.getElementById("root"))
    .render(
        <div>
              <UserForm/> 
        </div>
    );