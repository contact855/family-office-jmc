"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [menu, setMenu] = useState("clients");

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
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedSousDossier) loadTaches();
  }, [selectedSousDossier]);

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
        <p style={{ cursor: "pointer" }} onClick={() => setMenu("clients")}>Clients</p>
      </div>

      <div style={{ flex: 1, background: "#f3f4f6", padding: 40 }}>

        {!selectedClient && (
          <>
            <h1>Clients</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {clients.map(c => (
                <div key={c.id}
                     onClick={() => openClient(c)}
                     style={{
                       background: "white",
                       padding: 20,
                       borderRadius: 10,
                       width: 250,
                       cursor: "pointer",
                       boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                     }}>
                  <h3>{c.nom}</h3>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedClient && !selectedDossier && (
          <>
            <button onClick={() => setSelectedClient(null)}>← Clients</button>
            <h1>{selectedClient.nom}</h1>

            <h2>Dossiers</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {dossiers.map(d => (
                <div key={d.id}
                     onClick={() => openDossier(d)}
                     style={{
                       background: "white",
                       padding: 20,
                       borderRadius: 10,
                       width: 250,
                       cursor: "pointer",
                       boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                     }}>
                  <h3>{d.nom}</h3>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedDossier && !selectedSousDossier && (
          <>
            <button onClick={() => setSelectedDossier(null)}>← Dossiers</button>
            <h1>{selectedDossier.nom}</h1>

            <h2>Sous-dossiers</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {sousDossiers.map(sd => (
                <div key={sd.id}
                     onClick={() => openSousDossier(sd)}
                     style={{
                       background: "white",
                       padding: 20,
                       borderRadius: 10,
                       width: 250,
                       cursor: "pointer",
                       boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                     }}>
                  <h3>{sd.nom}</h3>
                </div>
              ))}
            </div>
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

            <h2 style={{ marginTop: 30 }}>Tâches</h2>

            {taches.map(t => (
              <div key={t.id}
                   style={{
                     background: "white",
                     padding: 20,
                     borderRadius: 10,
                     marginTop: 10
                   }}>
                <strong>{t.titre}</strong>
                <div style={{ color: "#6b7280" }}>
                  Échéance : {t.date_echeance || "—"}
                </div>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
