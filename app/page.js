"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [taches, setTaches] = useState([]);
  const [factures, setFactures] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
  const { data: t } = await supabase
    .from("taches")
    .select("*")
    .order("date_echeance", { ascending: true });

  const { data: f } = await supabase
    .from("factures")
    .select("*")
    .order("date_echeance", { ascending: true });

  const today = new Date();

  const urgentes = (t || []).filter(x => {
    if (!x.date_echeance) return false;
    const d = new Date(x.date_echeance);
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  });

  setTaches(urgentes);
  setFactures(f || []);
}
  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Dashboard</h1>

      <h2>Tâches à venir</h2>
      {taches.map(t => (
        <div key={t.id}
             style={{
               padding: 10,
               border: "1px solid #ddd",
               marginTop: 10
             }}>
          {t.titre}
        </div>
      ))}

      <h2 style={{ marginTop: 40 }}>Factures à payer</h2>
      {factures.map(f => (
        <div key={f.id}
             style={{
               padding: 10,
               border: "1px solid #ddd",
               marginTop: 10
             }}>
          {f.libelle}
        </div>
      ))}
    </div>
  );
}
