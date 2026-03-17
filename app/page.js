"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [retards, setRetards] = useState([]);
  const [urgentes, setUrgentes] = useState([]);
  const [semaine, setSemaine] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data } = await supabase
      .from("taches")
      .select(`
        *,
        sous_dossiers (
          id,
          nom,
          dossiers (
            id,
            nom,
            entites (
              id,
              nom
            )
          )
        )
      `);

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

  function openTask(t) {
    alert(
      "Client: " + t.sous_dossiers?.dossiers?.entites?.nom +
      "\nDossier: " + t.sous_dossiers?.dossiers?.nom +
      "\nSous-dossier: " + t.sous_dossiers?.nom
    );
  }

  function TaskCard(t) {
    return (
      <div key={t.id}
           onClick={() => openTask(t)}
           style={{
             background: "white",
             padding: 15,
             borderRadius: 10,
             marginTop: 10,
             cursor: "pointer"
           }}>
        <strong>{t.titre}</strong>
        <div style={{ color: "#6b7280", fontSize: 13 }}>
          {t.sous_dossiers?.dossiers?.entites?.nom}
        </div>
        <div style={{ color: "#9ca3af", fontSize: 12 }}>
          {t.sous_dossiers?.dossiers?.nom} / {t.sous_dossiers?.nom}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial", background: "#f3f4f6", minHeight: "100vh" }}>
      <h1>Dashboard cabinet</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 30 }}>

        <div style={{ width: 300 }}>
          <h3>🔴 Retards</h3>
          {retards.map(TaskCard)}
        </div>

        <div style={{ width: 300 }}>
          <h3>🟠 Urgent</h3>
          {urgentes.map(TaskCard)}
        </div>

        <div style={{ width: 300 }}>
          <h3>🟡 Cette semaine</h3>
          {semaine.map(TaskCard)}
        </div>

      </div>
    </div>
  );
}
