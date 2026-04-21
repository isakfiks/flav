import { createRoot } from "react-dom/client";
import DesktopApp from "./DesktopApp";
import "../../../src/index.css";
import "./lib/tauri-bridge";

createRoot(document.getElementById("root")!).render(<DesktopApp />);
