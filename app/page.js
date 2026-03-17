"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [view, setView] = useState("dashboard");
  const [selectedClient, setSelectedClient] = useState(null);
  const [retards, setRetards] = useState([]);
  const [urgentes, setUrgentes] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data } = await supabase.from("taches").select("*");

    const today = new Date();
    const retard = [];
    const urgent = [];

    (data || []).forEach(t => {
      if (!t.date_echeance) return;
      const d = new Date(t.date_echeance);
      const diff = (d - today) / (1000 * 60 * 60 * 24);

      if (d < today) retard.push(t);
      else if (diff <= 3) urgent.push(t);
    });

    setRetards(retard);
    setUrgentes(urgent);
  }

  function Card(title, items, color) {
    return (
      <div style={{
        background: "white",
        padding: 30,
        borderRadius: 18,
        width: 360,
        boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
      }}>
        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 10 }}>
          {title}
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, color: color, marginBottom: 20 }}>
          {items.length}
        </div>
        {items.slice(0, 5).map(t => (
          <div key={t.id} style={{ marginBottom: 10 }}>{t.titre}</div>
        ))}
      </div>
    );
  }

  function Dashboard() {
    return (
      <>
        <h1 style={{ fontSize: 32, fontWeight: 600 }}>Dashboard</h1>
        <div style={{ display: "flex", gap: 40, marginTop: 50 }}>
          {Card("Retards", retards, "#dc2626")}
          {Card("Urgences", urgentes, "#ea580c")}
        </div>
      </>
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
        <h1 style={{ fontSize: 32 }}>Clients</h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 300px)",
          gap: 20,
          marginTop: 40
        }}>
          {clients.map(c => (
            <div key={c.id}
              onClick={() => {
                setSelectedClient(c);
                setView("fiche");
              }}
              style={{
                background: "white",
                padding: 25,
                borderRadius: 14,
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                cursor: "pointer"
              }}>
              <strong>{c.nom}</strong>
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
        <h1 style={{ fontSize: 32 }}>{selectedClient.nom}</h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 260px)",
          gap: 20,
          marginTop: 40
        }}>
          {dossiers.map(d => (
            <div key={d.id}
              style={{
                background: "white",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
              }}>
              {d.nom}
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
    if (view === "agenda") return <h1>Agenda (à venir)</h1>;
    if (view === "factures") return <h1>Factures (à venir)</h1>;
    if (view === "locations") return <h1>Locations (à venir)</h1>;
  }

  function MenuItem(label, key) {
    return (
      <p onClick={() => setView(key)}
        style={{
          marginBottom: 15,
          cursor: "pointer",
          opacity: view === key ? 1 : 0.6
        }}>
        {label}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, Arial", background: "#f3f4f6" }}>
      
      <div style={{
        width: 260,
        background: "#0f172a",
        color: "white",
        padding: 30
      }}>
        <h2 style={{ marginBottom: 40 }}>Family Office</h2>
        {MenuItem("Dashboard", "dashboard")}
        {MenuItem("Clients", "clients")}
        {MenuItem("Agenda", "agenda")}
        {MenuItem("Factures", "factures")}
        {MenuItem("Locations", "locations")}
      </div>

      <div style={{ flex: 1, padding: 60 }}>
        {renderContent()}
      </div>
    </div>
  );
}
