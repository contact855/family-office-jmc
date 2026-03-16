"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [clients, setClients] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [taches, setTaches] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    const { data } = await supabase.from("entites").select("*");
    setClients(data || []);
  }

  async function openClient(client) {
    setSelectedClient(client);

    const { data: d } = await supabase
      .from("dossiers")
      .select("*")
      .eq("entite_id", client.id);

    setDossiers(d || []);

    const { data: t } = await supabase
      .from("taches")
      .select("*")
      .eq("entite_id", client.id);

    setTaches(t || []);
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      {!selectedClient && (
        <div>
          <h1>Clients</h1>
          {clients.map((c) => (
            <div
              key={c.id}
              onClick={() => openClient(c)}
              style={{
                padding: 15,
                border: "1px solid #ddd",
                marginTop: 10,
                cursor: "pointer",
              }}
            >
              {c.nom}
            </div>
          ))}
        </div>
      )}

      {selectedClient && (
        <div>
          <button onClick={() => setSelectedClient(null)}>← Retour</button>

          <h1>Dossiers</h1>
          {dossiers.map((d) => (
            <div
              key={d.id}
              style={{
                padding: 10,
                border: "1px solid #ddd",
                marginTop: 10,
              }}
            >
              {d.nom}
            </div>
          ))}

          <h1 style={{ marginTop: 40 }}>Tâches</h1>
          {taches.map((t) => (
            <div
              key={t.id}
              style={{
                padding: 10,
                border: "1px solid #ddd",
                marginTop: 10,
              }}
            >
              {t.titre}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
