"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    loadTimeline();
  }, []);

  async function loadTimeline() {
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
      `)
      .order("date_echeance", { ascending: true });

    setTimeline(data || []);
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
    <div style={{ padding: 40, fontFamily: "Arial", background: "#f3f4f6", minHeight: "100vh" }}>
      <h1>Agenda cabinet</h1>

      {timeline.map(t => (
        <div
          key={t.id}
          style={{
            background: getColor(t.date_echeance),
            padding: 20,
            borderRadius: 10,
            marginTop: 10
          }}
        >
          <strong>{t.titre}</strong>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            {t.sous_dossiers?.dossiers?.entites?.nom}
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            Échéance : {t.date_echeance || "—"}
          </div>
        </div>
      ))}
    </div>
  );
}
