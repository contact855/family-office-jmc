"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [view, setView] = useState("dashboard");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [selectedSous, setSelectedSous] = useState(null);

  function Dashboard() {
    return (
      <div>
        <h1 style={{ fontSize: 32 }}>Dashboard</h1>
        <p>Bienvenue dans votre logiciel Family Office</p>
      </div>
    );
  }

  function ClientsPage() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
      loadClients();
    }, []);

    async function loadClients() {
      const { data } = await supabase.from("entites").select("*");
      setClients(data || []);
    }

    return (
      <div>
        <h1 style={{ fontSize: 28 }}>Clients</h1>

        <div style={{ marginTop: 30 }}>
          {clients.map(c => (
            <div key={c.id}
              onClick={() => {
                setSelectedClient(c);
                setView("dossiers");
              }}
              style={{
                background: "white",
                padding: 15,
                borderRadius: 10,
                marginTop: 10,
                cursor: "pointer"
              }}>
              {c.nom}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function DossiersPage() {
    const [dossiers, setDossiers] = useState([]);

    useEffect(() => {
      loadDossiers();
    }, []);

    async function loadDossiers() {
      const { data } = await supabase
        .from("dossiers")
        .select("*")
        .eq("entite_id", selectedClient.id);

      setDossiers(data || []);
    }

    return (
      <div>
        <button onClick={() => setView("clients")}>← Retour</button>
        <h1>{selectedClient.nom}</h1>

        {dossiers.map(d => (
          <div key={d.id}
            onClick={() => {
              setSelectedDossier(d);
              setView("sous");
            }}
            style={{
              background: "white",
              padding: 15,
              marginTop: 10,
              borderRadius: 10,
              cursor: "pointer"
            }}>
            {d.nom}
          </div>
        ))}
      </div>
    );
  }

  function SousPage() {
    const [sous, setSous] = useState([]);

    useEffect(() => {
      loadSous();
    }, []);

    async function loadSous() {
      const { data } = await supabase
        .from("sous_dossiers")
        .select("*")
        .eq("dossier_id", selectedDossier.id);

      setSous(data || []);
    }

    return (
      <div>
        <button onClick={() => setView("dossiers")}>← Retour</button>
        <h1>{selectedDossier.nom}</h1>

        {sous.map(s => (
          <div key={s.id}
            onClick={() => {
              setSelectedSous(s);
              setView("taches");
            }}
            style={{
              background: "white",
              padding: 15,
              marginTop: 10,
              borderRadius: 10,
              cursor: "pointer"
            }}>
            {s.nom}
          </div>
        ))}
      </div>
    );
  }

  function TachesPage() {
    const [taches, setTaches] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
      loadTaches();
    }, []);

    async function loadTaches() {
      const { data } = await supabase
        .from("taches")
        .select("*")
        .eq("sous_dossier_id", selectedSous.id);

      setTaches(data || []);
    }

    async function addTask() {
      if (!newTask) return;

      await supabase.from("taches").insert({
        titre: newTask,
        sous_dossier_id: selectedSous.id
      });

      setNewTask("");
      loadTaches();
    }

    return (
      <div>
        <button onClick={() => setView("sous")}>← Retour</button>
        <h1>{selectedSous.nom}</h1>

        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Nouvelle tâche"
          style={{ padding: 10, marginTop: 20 }}
        />

        <button onClick={addTask} style={{ marginLeft: 10 }}>
          Ajouter
        </button>

        {taches.map(t => (
          <div key={t.id}
            style={{
              background: "white",
              padding: 15,
              marginTop: 10,
              borderRadius: 10
            }}>
            {t.titre}
          </div>
        ))}
      </div>
    );
  }

  function renderContent() {
    if (view === "dashboard") return <Dashboard />;
    if (view === "clients") return <ClientsPage />;
    if (view === "dossiers") return <DossiersPage />;
    if (view === "sous") return <SousPage />;
    if (view === "taches") return <TachesPage />;
  }

  function MenuItem(label, key) {
    return (
      <p
        onClick={() => setView(key)}
        style={{ marginBottom: 15, cursor: "pointer" }}
      >
        {label}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{
        width: 250,
        background: "#0f172a",
        color: "white",
        padding: 30
      }}>
        <h2>Family Office</h2>
        {MenuItem("Dashboard", "dashboard")}
        {MenuItem("Clients", "clients")}
      </div>

      <div style={{ flex: 1, padding: 40, background: "#f3f4f6" }}>
        {renderContent()}
      </div>
    </div>
  );
}
