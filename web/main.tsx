import React from "react";
import { createRoot } from "react-dom/client";
import AuditoryTrainer from "./app/components/AuditoryTrainer";
import "./app/globals.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuditoryTrainer />
  </React.StrictMode>,
);

