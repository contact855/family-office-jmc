"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [menu, setMenu] = useState("clients");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [dossiers, setDossiers] = useState([]);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const { data } = await supabase.from("entites").select("*");
    setClients(data || []);
  }

  async function openClient(client) {
    setSelectedClient(client);

    const { data } = await supabase
      .from("dossiers")
      .select("*")
      .eq("entite_id", client.id);

    setDossiers(data || []);
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* MENU */}
      <div style={{
        width: 260,
        background: "#0f172a",
        color: "white",
        padding: 20
      }}>
        <h2>Family Office</h2>

        <div style={{ marginTop: 40 }}>
          <p style={{ cursor: "pointer" }} onClick={() => setMenu("clients")}>👤 Clients</p>
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, padding: 40, background: "#f3f4f6" }}>

        {!selectedClient && (
          <>
            <h1>Clients</h1>

            {clients.map(c => (
              <div key={c.id}
                   onClick={() => openClient(c)}
                   style={{
                     background: "white",
                     padding: 20,
                     marginTop: 10,
                     borderRadius: 8,
                     cursor: "pointer"
                   }}>
                {c.nom}
              </div>
            ))}
          </>
        )}

        {selectedClient && (
          <>
            <button onClick={() => setSelectedClient(null)}>← Retour</button>

            <h1>{selectedClient.nom}</h1>

            <h2>Dossiers</h2>

            {dossiers.map(d => (
              <div key={d.id}
                   style={{
                     background: "white",
                     padding: 20,
                     marginTop: 10,
                     borderRadius: 8
                   }}>
                {d.nom}
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
