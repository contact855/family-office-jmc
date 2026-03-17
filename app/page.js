"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [menu, setMenu] = useState("dashboard");

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [dossiers, setDossiers] = useState([]);
  const [selectedDossier, setSelectedDossier] = useState(null);

  const [sousDossiers, setSousDossiers] = useState([]);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const { data } = await supabase.from("entites").select("*");
    setClients(data || []);
  }

  async function openClient(client) {
    setSelectedClient(client);
    setSelectedDossier(null);

    const { data } = await supabase
      .from("dossiers")
      .select("*")
      .eq("entite_id", client.id);

    setDossiers(data || []);
  }

  async function openDossier(dossier) {
    setSelectedDossier(dossier);

    const { data } = await supabase
      .from("sous_dossiers")
      .select("*")
      .eq("dossier_id", dossier.id)
      .order("ordre_affichage");

    setSousDossiers(data || []);
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

        <div style={{ marginTop: 40 }}>
          <p style={{ cursor: "pointer" }} onClick={() => { setMenu("dashboard"); setSelectedClient(null); }}>Dashboard</p>
          <p style={{ cursor: "pointer" }} onClick={() => setMenu("clients")}>Clients</p>
        </div>
      </div>

      <div style={{ flex: 1, background: "#f3f4f6", padding: 40 }}>

        {menu === "clients" && !selectedClient && (
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

        {selectedDossier && (
          <>
            <button onClick={() => setSelectedDossier(null)}>← Dossiers</button>

            <h1>{selectedDossier.nom}</h1>

            <h2>Sous-dossiers</h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {sousDossiers.map(sd => (
                <div key={sd.id}
                     style={{
                       background: "white",
                       padding: 20,
                       borderRadius: 10,
                       width: 250,
                       boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                     }}>
                  <h3>{sd.nom}</h3>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
