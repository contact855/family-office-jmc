"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [menu, setMenu] = useState("dashboard");

  const [retards, setRetards] = useState([]);
  const [urgentes, setUrgentes] = useState([]);
  const [semaine, setSemaine] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data } = await supabase.from("taches").select("*");

    const today = new Date();

    const retard = [];
    const urgent = [];
    const week = [];

    (data || []).forEach(t => {
      if (!t.date_echeance) return;

      const d = new Date(t.date_echeance);
      const diff = (d - today) / (1000 * 60 * 60 * 24);

      if (d < today) retard.push(t);
      else if (diff <= 3) urgent.push(t);
      else if (diff <= 7) week.push(t);
    });

    setRetards(retard);
    setUrgentes(urgent);
    setSemaine(week);
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      <div style={{
        width: 260,
        background: "#111827",
        color: "white",
        padding: 30
      }}>
        <h2>Family Office</h2>
        <p style={{ cursor: "pointer" }} onClick={() => setMenu("dashboard")}>Dashboard</p>
        <p>Clients</p>
        <p>Échéances</p>
        <p>Factures</p>
        <p>Locations</p>
      </div>

      <div style={{ flex: 1, background: "#f3f4f6", padding: 40 }}>
        
        <h1>Dashboard cabinet</h1>

        <div style={{ display: "flex", gap: 20, marginTop: 30 }}>

          <div style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            width: 300
          }}>
            <h3>🔴 Retards</h3>
            {retards.map(t => (
              <div key={t.id} style={{ marginTop: 10 }}>
                {t.titre}
              </div>
            ))}
          </div>

          <div style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            width: 300
          }}>
            <h3>🟠 Urgent (3 jours)</h3>
            {urgentes.map(t => (
              <div key={t.id} style={{ marginTop: 10 }}>
                {t.titre}
              </div>
            ))}
          </div>

          <div style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            width: 300
          }}>
            <h3>🟡 Cette semaine</h3>
            {semaine.map(t => (
              <div key={t.id} style={{ marginTop: 10 }}>
                {t.titre}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
