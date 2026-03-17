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

  function Card(title, items, color) {
    return (
      <div style={{
        background: "white",
        padding: 30,
        borderRadius: 18,
        width: 360,
        boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
      }}>
        <div style={{
          fontSize: 14,
          color: "#6b7280",
          marginBottom: 10
        }}>
          {title}
        </div>

        <div style={{
          fontSize: 40,
          fontWeight: 600,
          color: color,
          marginBottom: 20
        }}>
          {items.length}
        </div>

        {items.slice(0, 5).map(t => (
          <div key={t.id} style={{ marginBottom: 10 }}>
            {t.titre}
          </div>
        ))}

      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, Arial", background: "#f3f4f6" }}>
      
      {/* MENU */}
      <div style={{
        width: 260,
        background: "#0f172a",
        color: "white",
        padding: 30
      }}>
        <h2 style={{ marginBottom: 40 }}>Family Office</h2>
        <p style={{ marginBottom: 15 }}>Dashboard</p>
        <p style={{ marginBottom: 15 }}>Clients</p>
        <p style={{ marginBottom: 15 }}>Agenda</p>
        <p style={{ marginBottom: 15 }}>Factures</p>
        <p style={{ marginBottom: 15 }}>Locations</p>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, padding: 60 }}>
        <h1 style={{ fontSize: 32, fontWeight: 600 }}>Dashboard</h1>
        <p style={{ color: "#6b7280", marginTop: 5 }}>
          Synthèse de l’activité administrative
        </p>

        <div style={{ display: "flex", gap: 40, marginTop: 50 }}>
          {Card("Retards", retards, "#dc2626")}
          {Card("Urgences", urgentes, "#ea580c")}
        </div>
      </div>
    </div>
  );
}
