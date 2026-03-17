"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [urgentes, setUrgentes] = useState([]);
  const [retards, setRetards] = useState([]);

  useEffect(() => {
    processRecurrence();
    loadDashboard();
  }, []);

  async function processRecurrence() {
    const { data } = await supabase
      .from("taches")
      .select("*")
      .eq("est_recurrente", true);

    const today = new Date();

    for (let t of data || []) {
      if (!t.date_echeance) continue;

      const d = new Date(t.date_echeance);

      if (d < today) {
        let next = new Date(d);

        if (t.frequence_recurrence === "mensuelle") next.setMonth(next.getMonth() + 1);
        if (t.frequence_recurrence === "trimestrielle") next.setMonth(next.getMonth() + 3);
        if (t.frequence_recurrence === "annuelle") next.setFullYear(next.getFullYear() + 1);

        const { data: existing } = await supabase
          .from("taches")
          .select("id")
          .eq("titre", t.titre)
          .eq("date_echeance", next);

        if (!existing || existing.length === 0) {
          await supabase.from("taches").insert({
            titre: t.titre,
            sous_dossier_id: t.sous_dossier_id,
            date_echeance: next,
            est_recurrente: true,
            frequence_recurrence: t.frequence_recurrence
          });
        }

        await supabase.from("taches")
          .update({ est_recurrente: false })
          .eq("id", t.id);
      }
    }
  }

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
    <div style={{ padding: 40 }}>
      <h1>Dashboard intelligent sécurisé</h1>

      <h2>🔴 Retards</h2>
      {retards.map(t => (
        <div key={t.id}>{t.titre} - {t.date_echeance}</div>
      ))}

      <h2>🟠 Urgences</h2>
      {urgentes.map(t => (
        <div key={t.id}>{t.titre} - {t.date_echeance}</div>
      ))}
    </div>
  );
}
