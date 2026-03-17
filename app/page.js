"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [retards, setRetards] = useState([]);
  const [urgentes, setUrgentes] = useState([]);
  const [charges, setCharges] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
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

    const retard = [];
    const urgent = [];
    const map = {};

    (data || []).forEach(t => {
      if (!t.date_echeance) return;

      const d = new Date(t.date_echeance);
      const diff = (d - today) / (1000 * 60 * 60 * 24);

      if (d < today) retard.push(t);
      else if (diff <= 3) urgent.push(t);

      const client = t.sous_dossiers?.dossiers?.entites?.nom || "Inconnu";

      if (!map[client]) map[client] = { retard: 0, urgent: 0 };

      if (d < today) map[client].retard++;
      else if (diff <= 3) map[client].urgent++;
    });

    const chargesList = Object.keys(map).map(c => ({
      client: c,
      retard: map[c].retard,
      urgent: map[c].urgent
    }));

    const sortedTimeline = (data || []).sort((a, b) => {
      return new Date(a.date_echeance) - new Date(b.date_echeance);
    });

    setRetards(retard);
    setUrgentes(urgent);
    setCharges(chargesList);
    setTimeline(sortedTimeline);
  }

  function getColor(date) {
    if (!date) return "#e5e7eb";

    const today = new Date();
    const d = new Date(date);
    const diff = (d - today) / (1000 * 60 * 60 * 24);

    if (d < today) return "#fecaca";
    if (diff <= 3) return "#fed7aa";
    return "#e5e7eb";
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial", background: "#f3f4f6" }}>
      <h1>Cockpit cabinet</h1>

      <h2>🔴 Retards</h2>
      {retards.map(t => (
        <div key={t.id}>{t.titre}</div>
      ))}

      <h2>🟠 Urgences</h2>
      {urgentes.map(t => (
        <div key={t.id}>{t.titre}</div>
      ))}

      <h2>📊 Charge clients</h2>
      {charges.map(c => (
        <div key={c.client}>
          {c.client} — Retards: {c.retard} | Urgences: {c.urgent}
        </div>
      ))}

      <h2>📅 Agenda</h2>
      {timeline.map(t => (
        <div
          key={t.id}
          style={{
            background: getColor(t.date_echeance),
            padding: 10,
            marginTop: 5
          }}
        >
          {t.titre}
        </div>
      ))}
    </div>
  );
}
