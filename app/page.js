"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [clients, setClients] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [menu, setMenu] = useState("clients");

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
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
      
      <div style={{ width: 260, background: "#111", color: "white", padding: 20 }}>
        <h2>Family Office</h2>
        <p style={{ cursor: "pointer" }} onClick={() => setMenu("clients")}>Clients</p>
      </div>

      <div style={{ flex: 1, padding: 40 }}>
        {menu === "clients" && !selectedClient && (
          <div>
            <h1>Clients</h1>

            {clients.map(c => (
              <div key={c.id}
                   onClick={() => openClient(c)}
                   style={{
                     padding: 15,
                     border: "1px solid #ddd",
                     marginTop: 10,
                     cursor: "pointer"
                   }}>
                {c.nom}
              </div>
            ))}
          </div>
        )}

        {selectedClient && (
          <div>
            <button onClick={() => setSelectedClient(null)}>← Retour</button>
            <h1>Dossiers de {selectedClient.nom}</h1>

            {dossiers.map(d => (
              <div key={d.id}
                   style={{
                     padding: 15,
                     border: "1px solid #ddd",
                     marginTop: 10
                   }}>
                {d.nom}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
