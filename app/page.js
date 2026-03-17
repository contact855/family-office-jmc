"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Bloc({ titre, children }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 20,
        marginTop: 20,
      }}
    >
      <h2 style={{ marginTop: 0 }}>{titre}</h2>
      {children}
    </div>
  );
}

function Ligne({ children }) {
  return (
    <div
      style={{
        padding: 12,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        marginTop: 10,
        background: "#fafafa",
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [taches, setTaches] = useState([]);
  const [factures, setFactures] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: t } = await supabase.from("taches").select("*");
    const { data: f } = await supabase.from("factures").select("*");
    const { data: l } = await supabase.from("locations_saisonnieres").select("*");

    const today = new Date();

    const urgentes = (t || []).filter((x) => {
      if (!x.date_echeance) return false;
      const d = new Date(x.date_echeance);
      const diff = (d - today) / (1000 * 60 * 60 * 24);
      return diff <= 3;
    });

    const rappelsLocations = (l || []).filter((x) => {
      if (!x.date_rappel_acompte) return false;
      const d = new Date(x.date_rappel_acompte);
      const diff = (d - today) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });

    setTaches(urgentes);
    setFactures(f || []);
    setLocations(rappelsLocations);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: 40,
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Family Office – JMC</h1>
      <p style={{ color: "#666" }}>Dashboard matin</p>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div
          style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            border: "1px solid #ddd",
            minWidth: 180,
          }}
        >
          <div style={{ color: "#666", fontSize: 14 }}>Tâches urgentes</div>
          <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 10 }}>
            {taches.length}
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            border: "1px solid #ddd",
            minWidth: 180,
          }}
        >
          <div style={{ color: "#666", fontSize: 14 }}>Factures</div>
          <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 10 }}>
            {factures.length}
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            border: "1px solid #ddd",
            minWidth: 180,
          }}
        >
          <div style={{ color: "#666", fontSize: 14 }}>Locations à traiter</div>
          <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 10 }}>
            {locations.length}
          </div>
        </div>
      </div>

      <Bloc titre="Tâches urgentes">
        {taches.length === 0 ? (
          <p>Aucune tâche urgente.</p>
        ) : (
          taches.map((t) => (
            <Ligne key={t.id}>
              <strong>{t.titre}</strong>
              <div style={{ color: "#666", marginTop: 4 }}>
                Échéance : {t.date_echeance || "non renseignée"}
              </div>
            </Ligne>
          ))
        )}
      </Bloc>

      <Bloc titre="Factures">
        {factures.length === 0 ? (
          <p>Aucune facture.</p>
        ) : (
          factures.map((f) => (
            <Ligne key={f.id}>
              <strong>{f.libelle}</strong>
              <div style={{ color: "#666", marginTop: 4 }}>
                Échéance : {f.date_echeance || "non renseignée"}
              </div>
            </Ligne>
          ))
        )}
      </Bloc>

      <Bloc titre="Locations à traiter">
        {locations.length === 0 ? (
          <p>Aucune location à traiter.</p>
        ) : (
          locations.map((loc) => (
            <Ligne key={loc.id}>
              <strong>{loc.bien}</strong> — {loc.nom_client_location}
              <div style={{ color: "#666", marginTop: 4 }}>
                Rappel acompte : {loc.date_rappel_acompte || "non renseigné"}
              </div>
            </Ligne>
          ))
        )}
      </Bloc>
    </div>
  );
}
