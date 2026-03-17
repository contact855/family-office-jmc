"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
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
    setSousDossiers([]);

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
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      
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

          <h2>Dossiers</h2>
          {dossiers.map(d => (
            <div key={d.id}
                 onClick={() => openDossier(d)}
                 style={{ background: "white", padding: 20, marginTop: 10, cursor: "pointer" }}>
              {d.nom}
            </div>
          ))}
        </>
      )}

      {selectedDossier && (
        <>
          <button onClick={() => setSelectedDossier(null)}>← Dossiers</button>
          <h1>{selectedDossier.nom}</h1>

          <h2>Sous-dossiers</h2>
          {sousDossiers.length === 0 && <p>Aucun sous-dossier</p>}

          {sousDossiers.map(sd => (
            <div key={sd.id}
                 style={{ background: "white", padding: 20, marginTop: 10 }}>
              {sd.nom}
            </div>
          ))}
        </>
      )}

    </div>
  );
}
