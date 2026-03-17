"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [view, setView] = useState("dashboard");

  const [clients, setClients] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [sousDossiers, setSousDossiers] = useState([]);
  const [taches, setTaches] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [selectedSousDossier, setSelectedSousDossier] = useState(null);

  const [dashboardTasks, setDashboardTasks] = useState([]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskRecurring, setNewTaskRecurring] = useState(false);
  const [newTaskFrequency, setNewTaskFrequency] = useState("mensuelle");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    boot();
  }, []);

  async function boot() {
    setLoading(true);
    setMessage("");
    try {
      await Promise.all([loadClients(), loadDashboard()]);
    } catch (e) {
      setMessage("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }

  async function loadClients() {
    const { data, error } = await supabase
      .from("entites")
      .select("*")
      .order("nom", { ascending: true });

    if (error) throw error;
    setClients(data || []);
  }

  async function loadDashboard() {
    const { data, error } = await supabase
      .from("taches")
      .select(`
        id,
        titre,
        date_echeance,
        est_recurrente,
        frequence_recurrence,
        sous_dossiers (
          id,
          nom,
          dossiers (
            id,
            nom,
            entites (
              id,
              nom
            )
          )
        )
      `);

    if (error) throw error;
    setDashboardTasks(data || []);
  }

  async function openClient(client) {
    setLoading(true);
    setMessage("");
    try {
      setSelectedClient(client);
      setSelectedDossier(null);
      setSelectedSousDossier(null);
      setSousDossiers([]);
      setTaches([]);

      const { data, error } = await supabase
        .from("dossiers")
        .select("*")
        .eq("entite_id", client.id)
        .order("nom", { ascending: true });

      if (error) throw error;
      setDossiers(data || []);
      setView("client");
    } catch (e) {
      setMessage("Impossible d’ouvrir le client.");
    } finally {
      setLoading(false);
    }
  }

  async function openDossier(dossier) {
    setLoading(true);
    setMessage("");
    try {
      setSelectedDossier(dossier);
      setSelectedSousDossier(null);
      setTaches([]);

      const { data, error } = await supabase
        .from("sous_dossiers")
        .select("*")
        .eq("dossier_id", dossier.id)
        .order("ordre_affichage", { ascending: true });

      if (error) throw error;
      setSousDossiers(data || []);
      setView("dossier");
    } catch (e) {
      setMessage("Impossible d’ouvrir le dossier.");
    } finally {
      setLoading(false);
    }
  }

  async function openSousDossier(sousDossier) {
    setLoading(true);
    setMessage("");
    try {
      setSelectedSousDossier(sousDossier);

      const { data, error } = await supabase
        .from("taches")
        .select("*")
        .eq("sous_dossier_id", sousDossier.id)
        .order("date_echeance", { ascending: true });

      if (error) throw error;
      setTaches(data || []);
      setView("taches");
    } catch (e) {
      setMessage("Impossible d’ouvrir le sous-dossier.");
    } finally {
      setLoading(false);
    }
  }

  async function addTask() {
    if (!selectedSousDossier || !newTaskTitle.trim()) return;

    setLoading(true);
    setMessage("");
    try {
      const payload = {
        titre: newTaskTitle.trim(),
        sous_dossier_id: selectedSousDossier.id,
        date_echeance: newTaskDueDate || null,
        est_recurrente: newTaskRecurring,
        frequence_recurrence: newTaskRecurring ? newTaskFrequency : null,
      };

      const { error } = await supabase.from("taches").insert(payload);
      if (error) throw error;

      setNewTaskTitle("");
      setNewTaskDueDate("");
      setNewTaskRecurring(false);
      setNewTaskFrequency("mensuelle");

      await Promise.all([openSousDossier(selectedSousDossier), loadDashboard()]);
      setMessage("Tâche ajoutée.");
    } catch (e) {
      setMessage("Impossible d’ajouter la tâche.");
    } finally {
      setLoading(false);
    }
  }

  function backToClients() {
    setView("clients");
    setSelectedClient(null);
    setSelectedDossier(null);
    setSelectedSousDossier(null);
    setDossiers([]);
    setSousDossiers([]);
    setTaches([]);
    setMessage("");
  }

  function backToClient() {
    setView("client");
    setSelectedDossier(null);
    setSelectedSousDossier(null);
    setSousDossiers([]);
    setTaches([]);
    setMessage("");
  }

  function backToDossier() {
    setView("dossier");
    setSelectedSousDossier(null);
    setTaches([]);
    setMessage("");
  }

  const dashboardData = useMemo(() => {
    const today = new Date();
    const retards = [];
    const urgentes = [];
    const semaine = [];

    for (const t of dashboardTasks) {
      if (!t.date_echeance) continue;

      const d = new Date(t.date_echeance);
      d.setHours(0, 0, 0, 0);

      const now = new Date(today);
      now.setHours(0, 0, 0, 0);

      const diff = (d - now) / (1000 * 60 * 60 * 24);

      if (diff < 0) retards.push(t);
      else if (diff <= 3) urgentes.push(t);
      else if (diff <= 7) semaine.push(t);
    }

    const chargeParClientMap = {};

    for (const t of [...retards, ...urgentes]) {
      const clientName = t.sous_dossiers?.dossiers?.entites?.nom || "Inconnu";
      if (!chargeParClientMap[clientName]) {
        chargeParClientMap[clientName] = { client: clientName, retard: 0, urgent: 0 };
      }

      if (retards.find((x) => x.id === t.id)) chargeParClientMap[clientName].retard += 1;
      if (urgentes.find((x) => x.id === t.id)) chargeParClientMap[clientName].urgent += 1;
    }

    const chargeParClient = Object.values(chargeParClientMap).sort(
      (a, b) => b.retard + b.urgent - (a.retard + a.urgent)
    );

    return { retards, urgentes, semaine, chargeParClient };
  }, [dashboardTasks]);

  function taskColor(task) {
    if (!task.date_echeance) return "#ffffff";

    const d = new Date(task.date_echeance);
    d.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diff = (d - now) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "#fee2e2";
    if (diff <= 3) return "#ffedd5";
    if (diff <= 7) return "#fef3c7";
    return "#ffffff";
  }

  function MenuItem({ label, keyName }) {
    const active = view === keyName || (keyName === "clients" && ["client", "dossier", "taches"].includes(view));
    return (
      <div
        onClick={() => {
          if (keyName === "dashboard") setView("dashboard");
          if (keyName === "clients") backToClients();
        }}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          cursor: "pointer",
          marginBottom: 8,
          background: active ? "rgba(255,255,255,0.12)" : "transparent",
          opacity: active ? 1 : 0.8,
        }}
      >
        {label}
      </div>
    );
  }

  function Panel({ title, subtitle, children }) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 600 }}>{title}</div>
          {subtitle ? (
            <div style={{ color: "#6b7280", marginTop: 4, fontSize: 14 }}>{subtitle}</div>
          ) : null}
        </div>
        {children}
      </div>
    );
  }

  function MetricCard({ label, value, color }) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 22,
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          minWidth: 220,
        }}
      >
        <div style={{ fontSize: 14, color: "#6b7280" }}>{label}</div>
        <div style={{ fontSize: 34, fontWeight: 700, color, marginTop: 8 }}>{value}</div>
      </div>
    );
  }

  function DashboardView() {
    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 34 }}>Dashboard</h1>
          <div style={{ color: "#6b7280", marginTop: 6 }}>
            Vue synthétique de l’activité administrative
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <MetricCard label="Retards" value={dashboardData.retards.length} color="#dc2626" />
          <MetricCard label="Urgences 3 jours" value={dashboardData.urgentes.length} color="#ea580c" />
          <MetricCard label="Cette semaine" value={dashboardData.semaine.length} color="#ca8a04" />
          <MetricCard label="Clients chargés" value={dashboardData.chargeParClient.length} color="#0f172a" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Panel title="Retards" subtitle="Tâches à traiter immédiatement">
            {dashboardData.retards.length === 0 ? (
              <div style={{ color: "#9ca3af" }}>Aucun retard</div>
            ) : (
              dashboardData.retards.slice(0, 8).map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: taskColor(t),
                    padding: 14,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{t.titre}</div>
                  <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
                    {t.sous_dossiers?.dossiers?.entites?.nom || "Inconnu"}
                  </div>
                </div>
              ))
            )}
          </Panel>

          <Panel title="Urgences" subtitle="Échéance dans les 3 jours">
            {dashboardData.urgentes.length === 0 ? (
              <div style={{ color: "#9ca3af" }}>Aucune urgence</div>
            ) : (
              dashboardData.urgentes.slice(0, 8).map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: taskColor(t),
                    padding: 14,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{t.titre}</div>
                  <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
                    {t.sous_dossiers?.dossiers?.entites?.nom || "Inconnu"}
                  </div>
                </div>
              ))
            )}
          </Panel>

          <Panel title="Charge par client" subtitle="Retards et urgences par client">
            {dashboardData.chargeParClient.length === 0 ? (
              <div style={{ color: "#9ca3af" }}>Aucune charge critique</div>
            ) : (
              dashboardData.chargeParClient.map((c) => (
                <div
                  key={c.client}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{c.client}</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>
                    Retards: <span style={{ color: "#dc2626" }}>{c.retard}</span> | Urgences:{" "}
                    <span style={{ color: "#ea580c" }}>{c.urgent}</span>
                  </div>
                </div>
              ))
            )}
          </Panel>

          <Panel title="Cette semaine" subtitle="Vision chronologique court terme">
            {dashboardData.semaine.length === 0 ? (
              <div style={{ color: "#9ca3af" }}>Rien à signaler cette semaine</div>
            ) : (
              dashboardData.semaine.slice(0, 10).map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: taskColor(t),
                    padding: 14,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{t.titre}</div>
                  <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
                    {t.date_echeance || "—"}
                  </div>
                </div>
              ))
            )}
          </Panel>
        </div>
      </div>
    );
  }

  function ClientsView() {
    return (
      <div>
        <h1 style={{ margin: 0, fontSize: 32 }}>Clients</h1>
        <div style={{ color: "#6b7280", marginTop: 6 }}>Accès rapide aux dossiers clients</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
            marginTop: 26,
          }}
        >
          {clients.map((c) => (
            <div
              key={c.id}
              onClick={() => openClient(c)}
              style={{
                background: "white",
                padding: 22,
                borderRadius: 16,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 18 }}>{c.nom}</div>
              <div style={{ color: "#6b7280", fontSize: 14, marginTop: 8 }}>Ouvrir la fiche client</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ClientView() {
    return (
      <div>
        <button onClick={backToClients} style={backButtonStyle}>
          ← Retour aux clients
        </button>

        <h1 style={{ marginTop: 18, marginBottom: 0, fontSize: 32 }}>{selectedClient?.nom}</h1>
        <div style={{ color: "#6b7280", marginTop: 6 }}>Dossiers administratifs du client</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 26,
          }}
        >
          {dossiers.map((d) => (
            <div
              key={d.id}
              onClick={() => openDossier(d)}
              style={{
                background: "white",
                padding: 20,
                borderRadius: 14,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontWeight: 700 }}>{d.nom}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function DossierView() {
    return (
      <div>
        <button onClick={backToClient} style={backButtonStyle}>
          ← Retour aux dossiers
        </button>

        <h1 style={{ marginTop: 18, marginBottom: 0, fontSize: 32 }}>{selectedDossier?.nom}</h1>
        <div style={{ color: "#6b7280", marginTop: 6 }}>Sous-dossiers opérationnels</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 26,
          }}
        >
          {sousDossiers.map((s) => (
            <div
              key={s.id}
              onClick={() => openSousDossier(s)}
              style={{
                background: "white",
                padding: 20,
                borderRadius: 14,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontWeight: 700 }}>{s.nom}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function TachesView() {
    return (
      <div>
        <button onClick={backToDossier} style={backButtonStyle}>
          ← Retour aux sous-dossiers
        </button>

        <h1 style={{ marginTop: 18, marginBottom: 0, fontSize: 32 }}>{selectedSousDossier?.nom}</h1>
        <div style={{ color: "#6b7280", marginTop: 6 }}>Tâches opérationnelles du sous-dossier</div>

        <Panel title="Nouvelle tâche" subtitle="Création rapide">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Titre de la tâche"
              style={inputStyle}
            />

            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              style={inputStyle}
            />

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={newTaskRecurring}
                onChange={(e) => setNewTaskRecurring(e.target.checked)}
              />
              Récurrente
            </label>

            {newTaskRecurring ? (
              <select
                value={newTaskFrequency}
                onChange={(e) => setNewTaskFrequency(e.target.value)}
                style={inputStyle}
              >
                <option value="mensuelle">Mensuelle</option>
                <option value="trimestrielle">Trimestrielle</option>
                <option value="annuelle">Annuelle</option>
              </select>
            ) : null}

            <button onClick={addTask} style={primaryButtonStyle}>
              Ajouter
            </button>
          </div>
        </Panel>

        <div style={{ marginTop: 22 }}>
          <Panel title="Tâches" subtitle={`${taches.length} tâche(s)`}>
            {taches.length === 0 ? (
              <div style={{ color: "#9ca3af" }}>Aucune tâche pour ce sous-dossier</div>
            ) : (
              taches.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: taskColor(t),
                    padding: 14,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{t.titre}</div>
                  <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
                    Échéance : {t.date_echeance || "—"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>
                    Récurrence : {t.est_recurrente ? t.frequence_recurrence : "Non"}
                  </div>
                </div>
              ))
            )}
          </Panel>
        </div>
      </div>
    );
  }

  function renderContent() {
    if (view === "dashboard") return <DashboardView />;
    if (view === "clients") return <ClientsView />;
    if (view === "client") return <ClientView />;
    if (view === "dossier") return <DossierView />;
    if (view === "taches") return <TachesView />;
    return <DashboardView />;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          width: 260,
          background: "#0f172a",
          color: "white",
          padding: 30,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 30 }}>Family Office</h2>

        <MenuItem label="Dashboard" keyName="dashboard" current={view} onClick={() => setView("dashboard")} />
        <MenuItem label="Clients" keyName="clients" current={view} onClick={backToClients} />

        <div style={{ marginTop: 40, fontSize: 12, opacity: 0.5 }}>Version stable MVP</div>
      </div>

      <div style={{ flex: 1, padding: 40 }}>
        {loading ? <div style={{ marginBottom: 16 }}>Chargement…</div> : null}
        {message ? <div style={{ marginBottom: 16, color: "#0f172a" }}>{message}</div> : null}
        {renderContent()}
      </div>
    </div>
  );
}

function MenuItem({ label, keyName, current, onClick }) {
  const active =
    current === keyName ||
    (keyName === "clients" && ["client", "dossier", "taches"].includes(current));

  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        cursor: "pointer",
        marginBottom: 8,
        background: active ? "rgba(255,255,255,0.12)" : "transparent",
        opacity: active ? 1 : 0.8,
      }}
    >
      {label}
    </div>
  );
}

const backButtonStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#e2e8f0",
  cursor: "pointer",
};

const primaryButtonStyle = {
  padding: "12px 16px",
  borderRadius: 10,
  border: "none",
  background: "#0f172a",
  color: "white",
  cursor: "pointer",
};

const inputStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "white",
};

function taskColor(task) {
  if (!task.date_echeance) return "#ffffff";

  const d = new Date(task.date_echeance);
  d.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diff = (d - now) / (1000 * 60 * 60 * 24);

  if (diff < 0) return "#fee2e2";
  if (diff <= 3) return "#ffedd5";
  if (diff <= 7) return "#fef3c7";
  return "#ffffff";
}
