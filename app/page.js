"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [menu, setMenu] = useState("dashboard");

  const [retards, setRetards] = useState([]);
  const [urgentes, setUrgentes] = useState([]);
  const [semaine, setSemaine] = useState([]);

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [dossiers, setDossiers] = useState([]);
  const [selectedDossier, setSelectedDossier] = useState(null);

  const [sousDossiers, setSousDossiers] = useState([]);
  const [selectedSousDossier, setSelectedSousDossier] = useState(null);

  const [taches, setTaches] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedSousDossier) loadTaches();
  }, [selectedSousDossier]);

  async function loadClients() {
    const { data } = await supabase.from("entites").select("*");
    setClients(data || []);
  }

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

  async function openTask(t) {
    const client = t.sous_dossiers?.dossiers?.entites;
    const dossier = t.sous_dossiers?.dossiers;
    const sousDossier = t.sous_dossiers;

    setMenu("clients");

    setSelectedClient(client);

    const { data: d } = await supabase
      .from("dossiers")
      .select("*")
      .eq("entite_id", client.id);

    setDossiers(d || []);
    setSelectedDossier(dossier);

    const { data: sd } = await supabase
      .from("sous_dossiers")
      .select("*")
      .eq("dossier_id", dossier.id);

    setSousDossiers(sd || []);
    setSelectedSousDossier(sousDossier);
  }

  async function loadTaches() {
    const { data } = await supabase
      .from("taches")
      .select("*")
      .eq("sous_dossier_id", selectedSousDossier.id);

    setTaches(data || []);
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
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      <div style={{
        width: 260,
        background: "#111827",
        color: "white",
        padding: 30
      }}>
        <h2>Family Office</h2>
        <p style={{ cursor: "pointer" }} onClick={() => setMenu("dashboard")}>Dashboard</p>
        <p style={{ cursor: "pointer" }} onClick={() => setMenu("clients")}>Clients</p>
      </div>

      <div style={{ flex: 1, background: "#f3f4f6", padding: 40 }}>

        {menu === "dashboard" && (
          <>
            <h1>Dashboard cabinet</h1>

            <div style={{ display: "flex", gap: 20 }}>
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
          </>
        )}

        {menu === "clients" && !selectedClient && (
          <>
            <h1>Clients</h1>
            {clients.map(c => (
              <div key={c.id}
                   onClick={() => setSelectedClient(c)}
                   style={{ background: "white", padding: 15, marginTop: 10, cursor: "pointer" }}>
                {c.nom}
              </div>
            ))}
          </>
        )}

        {selectedClient && !selectedDossier && (
          <>
            <button onClick={() => setSelectedClient(null)}>← Clients</button>
            <h1>{selectedClient.nom}</h1>
            {dossiers.map(d => (
              <div key={d.id}
                   onClick={() => setSelectedDossier(d)}
                   style={{ background: "white", padding: 15, marginTop: 10, cursor: "pointer" }}>
                {d.nom}
              </div>
            ))}
          </>
        )}

        {selectedDossier && !selectedSousDossier && (
          <>
            <button onClick={() => setSelectedDossier(null)}>← Dossiers</button>
            <h1>{selectedDossier.nom}</h1>
            {sousDossiers.map(sd => (
              <div key={sd.id}
                   onClick={() => setSelectedSousDossier(sd)}
                   style={{ background: "white", padding: 15, marginTop: 10, cursor: "pointer" }}>
                {sd.nom}
              </div>
            ))}
          </>
        )}

        {selectedSousDossier && (
          <>
            <button onClick={() => setSelectedSousDossier(null)}>← Sous-dossiers</button>
            <h1>{selectedSousDossier.nom}</h1>
            {taches.map(t => (
              <div key={t.id} style={{ background: "white", padding: 15, marginTop: 10 }}>
                {t.titre}
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
