"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [menu, setMenu] = useState("dashboard");

  const [urgentes, setUrgentes] = useState([]);
  const [retards, setRetards] = useState([]);

  const [clients, setClients] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadClients();
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

  async function loadClients() {
    const { data } = await supabase.from("entites").select("*");
    setClients(data || []);
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
          <p style={{ cursor: "pointer" }} onClick={() => setMenu("dashboard")}>Dashboard</p>
          <p style={{ cursor: "pointer" }} onClick={() => setMenu("clients")}>Clients</p>
          <p>Échéances</p>
          <p>Factures</p>
          <p>Locations</p>
          <p>Paramètres</p>
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, background: "#f3f4f6", padding: 40 }}>
        
        {menu === "dashboard" && (
          <>
            <h1>Dashboard matin</h1>

            <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
              <div style={{ background: "white", padding: 20, borderRadius: 10, width: 300 }}>
                <h3>🔴 Retards</h3>
                {retards.map(t => (
                  <div key={t.id} style={{ marginTop: 10 }}>{t.titre}</div>
                ))}
              </div>

              <div style={{ background: "white", padding: 20, borderRadius: 10, width: 300 }}>
                <h3>🟠 Urgences</h3>
                {urgentes.map(t => (
                  <div key={t.id} style={{ marginTop: 10 }}>{t.titre}</div>
                ))}
              </div>
            </div>
          </>
        )}

        {menu === "clients" && (
          <>
            <h1>Clients</h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 30 }}>
              {clients.map(c => (
                <div key={c.id}
                     style={{
                       background: "white",
                       padding: 20,
                       borderRadius: 10,
                       width: 250,
                       cursor: "pointer",
                       boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                     }}>
                  <h3>{c.nom}</h3>
                  <p style={{ color: "#6b7280" }}>Dossier actif</p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
