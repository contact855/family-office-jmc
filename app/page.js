"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [clients, setClients] = useState([]);
  const [menu, setMenu] = useState("dashboard");

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    const { data } = await supabase
      .from("entites")
      .select("*");

    setClients(data || []);
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* MENU */}
      <div style={{ width: 260, background: "#111", color: "white", padding: 20 }}>
        <h2>Family Office</h2>

        <div style={{ marginTop: 40 }}>
          <p onClick={() => setMenu("dashboard")} style={{ cursor: "pointer" }}>Dashboard</p>
          <p onClick={() => setMenu("clients")} style={{ cursor: "pointer" }}>Clients</p>
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, padding: 40 }}>
        {menu === "dashboard" && <h1>Dashboard</h1>}

        {menu === "clients" && (
          <div>
            <h1>Clients</h1>

            {clients.map(c => (
              <div key={c.id} style={{
                padding: 15,
                border: "1px solid #ddd",
                marginTop: 10
              }}>
                {c.nom}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
