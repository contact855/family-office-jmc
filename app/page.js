"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [view, setView] = useState("dashboard");
  const [clients, setClients] = useState([]);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const { data } = await supabase.from("entites").select("*");
    setClients(data || []);
  }

  function MenuItem(icon, label, key) {
    return (
      <div
        onClick={() => setView(key)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderRadius: 10,
          cursor: "pointer",
          background: view === key ? "rgba(255,255,255,0.1)" : "transparent"
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span>{label}</span>
      </div>
    );
  }

  function Dashboard() {
    return (
      <div>
        <h1 style={{ fontSize: 32 }}>🏠 Dashboard</h1>
        <p style={{ color: "#6b7280" }}>
          Vue globale de votre activité administrative
        </p>
      </div>
    );
  }

  function Clients() {
    return (
      <div>
        <h1 style={{ fontSize: 32 }}>👥 Clients</h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 260px)",
          gap: 20,
          marginTop: 30
        }}>
          {clients.map(c => (
            <div key={c.id}
              style={{
                background: "white",
                padding: 20,
                borderRadius: 14,
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
              }}>
              <strong>🏢 {c.nom}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderContent() {
    if (view === "dashboard") return <Dashboard />;
    if (view === "clients") return <Clients />;
  }

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      fontFamily: "Inter, Arial",
      background: "#f3f4f6"
    }}>
      
      <div style={{
        width: 260,
        background: "#0f172a",
        color: "white",
        padding: 30
      }}>
        <h2 style={{ marginBottom: 40 }}>🏛 Family Office</h2>

        {MenuItem("🏠", "Dashboard", "dashboard")}
        {MenuItem("👥", "Clients", "clients")}
        {MenuItem("📅", "Agenda", "agenda")}
        {MenuItem("💰", "Factures", "factures")}
        {MenuItem("🏡", "Locations", "locations")}

        <div style={{
          marginTop: 40,
          fontSize: 12,
          opacity: 0.4
        }}>
          Version interne
        </div>
      </div>

      <div style={{
        flex: 1,
        padding: 50
      }}>
        {renderContent()}
      </div>
    </div>
  );
}
