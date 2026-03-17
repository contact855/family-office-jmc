"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [retards, setRetards] = useState([]);
  const [urgentes, setUrgentes] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data } = await supabase.from("taches").select("*");

    const today = new Date();

    const retard = [];
    const urgent = [];

    (data || []).forEach(t => {
      if (!t.date_echeance) return;

      const d = new Date(t.date_echeance);
      const diff = (d - today) / (1000 * 60 * 60 * 24);

      if (d < today) retard.push(t);
      else if (diff <= 3) urgent.push(t);
    });

    setRetards(retard);
    setUrgentes(urgent);
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, Arial", background: "#f9fafb" }}>
      
      {/* MENU */}
      <div style={{
        width: 260,
        background: "#111827",
        color: "white",
        padding: 30,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div>
          <h2 style={{ marginBottom: 40 }}>Family Office</h2>

          <div style={{ opacity: 0.9 }}>
            <p style={{ marginBottom: 15 }}>Dashboard</p>
            <p style={{ marginBottom: 15 }}>Clients</p>
            <p style={{ marginBottom: 15 }}>Agenda</p>
            <p style={{ marginBottom: 15 }}>Factures</p>
            <p style={{ marginBottom: 15 }}>Locations</p>
          </div>
        </div>

        <div style={{ fontSize: 12, opacity: 0.5 }}>
          v1 interne
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, padding: 50 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>Dashboard</h1>
        <p style={{ color: "#6b7280", marginTop: 5 }}>
          Vue synthétique de l’activité administrative
        </p>

        <div style={{ display: "flex", gap: 30, marginTop: 40 }}>
          
          {/* RETARDS */}
          <div style={{
            background: "white",
            padding: 25,
            borderRadius: 14,
            width: 340,
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ marginBottom: 20 }}>🔴 Retards</h3>
            {retards.length === 0 && <p style={{ color: "#9ca3af" }}>Aucun retard</p>}
            {retards.map(t => (
              <div key={t.id} style={{ marginBottom: 12 }}>
                {t.titre}
              </div>
            ))}
          </div>

          {/* URGENCES */}
          <div style={{
            background: "white",
            padding: 25,
            borderRadius: 14,
            width: 340,
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ marginBottom: 20 }}>🟠 Urgences</h3>
            {urgentes.length === 0 && <p style={{ color: "#9ca3af" }}>Aucune urgence</p>}
            {urgentes.map(t => (
              <div key={t.id} style={{ marginBottom: 12 }}>
                {t.titre}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
