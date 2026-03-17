"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [urgentes, setUrgentes] = useState([]);
  const [retards, setRetards] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data } = await supabase.from("taches").select("*");

    const today = new Date();

    const urg = (data || []).filter(x => {
      if (!x.date_echeance) return false;
      const d = new Date(x.date_echeance);
      const diff = (d - today) / (1000 * 60 * 60 * 24);
      return diff <= 3 && diff >= 0;
    });

    const ret = (data || []).filter(x => {
      if (!x.date_echeance) return false;
      const d = new Date(x.date_echeance);
      return d < today;
    });

    setUrgentes(urg);
    setRetards(ret);
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* MENU */}
      <div style={{
        width: 260,
        background: "#111827",
        color: "white",
        padding: 30
      }}>
        <h2>Family Office</h2>

        <div style={{ marginTop: 40 }}>
          <p>Dashboard</p>
          <p>Clients</p>
          <p>Échéances</p>
          <p>Factures</p>
          <p>Locations</p>
          <p>Paramètres</p>
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, background: "#f3f4f6", padding: 40 }}>
        
        <h1>Dashboard matin</h1>

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
            <h3>🟠 Urgences</h3>
            {urgentes.map(t => (
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
