"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [charges, setCharges] = useState([]);

  useEffect(() => {
    loadCharges();
  }, []);

  async function loadCharges() {
    const { data } = await supabase
      .from("taches")
      .select(`
        *,
        sous_dossiers (
          dossiers (
            entites (
              nom
            )
          )
        )
      `);

    const today = new Date();

    const map = {};

    (data || []).forEach(t => {
      if (!t.date_echeance) return;

      const client = t.sous_dossiers?.dossiers?.entites?.nom || "Inconnu";

      if (!map[client]) {
        map[client] = { retard: 0, urgent: 0 };
      }

      const d = new Date(t.date_echeance);
      const diff = (d - today) / (1000 * 60 * 60 * 24);

      if (d < today) map[client].retard++;
      else if (diff <= 3) map[client].urgent++;
    });

    const result = Object.keys(map).map(c => ({
      client: c,
      retard: map[c].retard,
      urgent: map[c].urgent
    }));

    setCharges(result);
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial", background: "#f3f4f6", minHeight: "100vh" }}>
      <h1>Charge cabinet</h1>

      {charges.map(c => (
        <div
          key={c.client}
          style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            marginTop: 10
          }}
        >
          <strong>{c.client}</strong>
          <div style={{ color: "red" }}>Retards : {c.retard}</div>
          <div style={{ color: "orange" }}>Urgences : {c.urgent}</div>
        </div>
      ))}
    </div>
  );
}
