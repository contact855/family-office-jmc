"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [menu, setMenu] = useState("dashboard");
  const [clients, setClients] = useState([]);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const { data } = await supabase.from("entites").select("*");
    setClients(data || []);
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* MENU */}
      <div style={{
        width: 260,
        background: "#0f172a",
        color: "white",
        padding: 20
      }}>
        <h2>Family Office</h2>

        <div style={{ marginTop: 40 }}>
          <p style={{ cursor: "pointer" }} onClick={() => setMenu("dashboard")}>🏠 Dashboard</p>
          <p style={{ cursor: "pointer" }} onClick={() => setMenu("clients")}>👤 Clients</p>
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, padding: 40, background: "#f3f4f6" }}>

        {menu === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <p>Bienvenue dans votre logiciel Family Office</p>
          </>
        )}

        {menu === "clients" && (
          <>
            <h1>Clients</h1>

            {clients.map(c => (
              <div key={c.id}
                   style={{
                     background: "white",
                     padding: 20,
                     marginTop: 10,
                     borderRadius: 8,
                     cursor: "pointer"
                   }}>
                {c.nom}
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
