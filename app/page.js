"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [view, setView] = useState("dashboard");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);

  function Dashboard() {
    return <h1>Dashboard</h1>;
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
        <h1>Clients</h1>
        <div style={{ display: "grid", gap: 20, marginTop: 30 }}>
          {clients.map(c => (
            <div key={c.id}
              onClick={() => {
                setSelectedClient(c);
                setView("fiche");
              }}
              style={{
                background: "white",
                padding: 20,
                borderRadius: 10,
                cursor: "pointer"
              }}>
              {c.nom}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ClientFiche() {
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
        <h1>{selectedClient.nom}</h1>

        <div style={{ display: "grid", gap: 20, marginTop: 30 }}>
          {dossiers.map(d => (
            <div key={d.id}
              onClick={() => {
                setSelectedDossier(d);
                setView("sousdossiers");
              }}
              style={{
                background: "white",
                padding: 20,
                borderRadius: 10,
                cursor: "pointer"
              }}>
              {d.nom}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function SousDossiersPage() {
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
        <h1>{selectedDossier.nom}</h1>

        <div style={{ display: "grid", gap: 20, marginTop: 30 }}>
          {sous.map(s => (
            <div key={s.id}
              style={{
                background: "white",
                padding: 20,
                borderRadius: 10
              }}>
              {s.nom}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderContent() {
    if (view === "dashboard") return <Dashboard />;
    if (view === "clients") return <ClientsPage />;
    if (view === "fiche") return <ClientFiche />;
    if (view === "sousdossiers") return <SousDossiersPage />;
  }

  function MenuItem(label, key) {
    return (
      <p onClick={() => setView(key)}
        style={{ marginBottom: 15, cursor: "pointer" }}>
        {label}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: 260, background: "#0f172a", color: "white", padding: 30 }}>
        <h2>Family Office</h2>
        {MenuItem("Dashboard", "dashboard")}
        {MenuItem("Clients", "clients")}
      </div>

      <div style={{ flex: 1, padding: 50, background: "#f3f4f6" }}>
        {renderContent()}
      </div>
    </div>
  );
}
