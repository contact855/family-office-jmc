"use client";

import { useState } from "react";

export default function Home() {
  const [menu, setMenu] = useState("dashboard");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* MENU LATERAL */}
      <div style={{
        width: 260,
        background: "#111",
        color: "white",
        padding: 20
      }}>
        <h2>Family Office</h2>

        <div style={{ marginTop: 40 }}>
          <p onClick={() => setMenu("dashboard")} style={{ cursor: "pointer" }}>Dashboard</p>
          <p onClick={() => setMenu("clients")} style={{ cursor: "pointer" }}>Clients</p>
          <p onClick={() => setMenu("dossiers")} style={{ cursor: "pointer" }}>Dossiers</p>
          <p onClick={() => setMenu("taches")} style={{ cursor: "pointer" }}>Tâches</p>
          <p onClick={() => setMenu("factures")} style={{ cursor: "pointer" }}>Factures</p>
          <p onClick={() => setMenu("documents")} style={{ cursor: "pointer" }}>Documents</p>
          <p onClick={() => setMenu("locations")} style={{ cursor: "pointer" }}>Locations</p>
        </div>
      </div>

      {/* ZONE PRINCIPALE */}
      <div style={{ flex: 1, padding: 40 }}>
        {menu === "dashboard" && <h1>Dashboard</h1>}
        {menu === "clients" && <h1>Clients</h1>}
        {menu === "dossiers" && <h1>Dossiers</h1>}
        {menu === "taches" && <h1>Tâches</h1>}
        {menu === "factures" && <h1>Factures</h1>}
        {menu === "documents" && <h1>Documents</h1>}
        {menu === "locations" && <h1>Locations</h1>}
      </div>

    </div>
  );
}
