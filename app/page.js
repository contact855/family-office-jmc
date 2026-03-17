"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [menu, setMenu] = useState("dashboard");
  const [urgentes, setUrgentes] = useState([]);
  const [retards, setRetards] = useState([]);

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [dossiers, setDossiers] = useState([]);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [sousDossiers, setSousDossiers] = useState([]);
  const [selectedSousDossier, setSelectedSousDossier] = useState(null);
  const [taches, setTaches] = useState([]);

  const [newTask, setNewTask] = useState("");
  const [dateEcheance, setDateEcheance] = useState("");

  useEffect(() => {
    loadDashboard();
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedSousDossier) loadTaches();
  }, [selectedSousDossier]);

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

  async function openClient(client) {
    setSelectedClient(client);
    setSelectedDossier(null);
    setSelectedSousDossier(null);

    const { data } = await supabase
      .from("dossiers")
      .select("*")
      .eq("entite_id", client.id);

    setDossiers(data || []);
    setMenu("clients");
  }

  async function openDossier(dossier) {
    setSelectedDossier(dossier);
    setSelectedSousDossier(null);

    const { data } = await supabase
      .from("sous_dossiers")
      .select("*")
      .eq("dossier_id", dossier.id)
      .order("ordre_affichage");

    setSousDossiers(data || []);
  }

  function openSousDossier(sd) {
    setSelectedSousDossier(sd);
  }

  async function loadTaches() {
    const { data } = await supabase
      .from("taches")
      .select("*")
      .eq("sous_dossier_id", selectedSousDossier.id)
      .order("date_echeance", { ascending: true });

    setTaches(data || []);
  }

  async function createTask() {
    if (!newTask) return;

    await supabase.from("taches").insert({
      titre: newTask,
      date_echeance: dateEcheance || null,
      sous_dossier_id: selectedSousDossier.id
    });

    setNewTask("");
    setDateEcheance("");
    loadTaches();
    loadDashboard();
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* MENU */}
      <div style={{ width: 260, background: "#0f172a", color: "white", padding: 20 }}>
        <h2>Family Office</h2>
        <p style={{ cursor: "pointer" }} onClick={() => setMenu("dashboard")}>Dashboard</p>
        <p style={{ cursor: "pointer" }} onClick={() => setMenu("clients")}>Clients</p>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, padding: 40, background: "#f3f4f6" }}>

        {menu === "dashboard" && (
          <>
            <h1>Dashboard matin</h1>

            <h2>🔴 En retard</h2>
            {retards.map(t => (
              <div key={t.id} style={{ background: "white", padding: 20, marginTop: 10 }}>
                {t.titre} — {t.date_echeance}
              </div>
            ))}

            <h2 style={{ marginTop: 40 }}>🟠 Urgences (3 jours)</h2>
            {urgentes.map(t => (
              <div key={t.id} style={{ background: "white", padding: 20, marginTop: 10 }}>
                {t.titre} — {t.date_echeance}
              </div>
            ))}
          </>
        )}

        {menu === "clients" && (
          <>
            {!selectedClient && (
              <>
                <h1>Clients</h1>
                {clients.map(c => (
                  <div key={c.id}
                       onClick={() => openClient(c)}
                       style={{ background: "white", padding: 20, marginTop: 10, cursor: "pointer" }}>
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
                       onClick={() => openDossier(d)}
                       style={{ background: "white", padding: 20, marginTop: 10, cursor: "pointer" }}>
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
                       onClick={() => openSousDossier(sd)}
                       style={{ background: "white", padding: 20, marginTop: 10, cursor: "pointer" }}>
                    {sd.nom}
                  </div>
                ))}
              </>
            )}

            {selectedSousDossier && (
              <>
                <button onClick={() => setSelectedSousDossier(null)}>← Sous-dossiers</button>
                <h1>{selectedSousDossier.nom}</h1>

                <div style={{ marginTop: 20 }}>
                  <input
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    placeholder="Nouvelle tâche"
                    style={{ padding: 10 }}
                  />
                  <input
                    type="date"
                    value={dateEcheance}
                    onChange={e => setDateEcheance(e.target.value)}
                    style={{ padding: 10, marginLeft: 10 }}
                  />
                  <button onClick={createTask} style={{ marginLeft: 10 }}>
                    Ajouter
                  </button>
                </div>

                {taches.map(t => (
                  <div key={t.id}
                       style={{ background: "white", padding: 20, marginTop: 10 }}>
                    {t.titre} — {t.date_echeance}
                  </div>
                ))}
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
