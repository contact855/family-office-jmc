"use client";

export default function Home() {
  return (
    <div style={{ display: "flex", fontFamily: "Arial", height: "100vh" }}>
      
      {/* MENU */}
      <div style={{
        width: 260,
        background: "#0f172a",
        color: "white",
        padding: 20
      }}>
        <h2>Family Office</h2>

        <div style={{ marginTop: 40 }}>
          <p>🏠 Dashboard</p>
          <p>👤 Clients</p>
          <p>📁 Dossiers</p>
          <p>📅 Échéances</p>
          <p>💰 Factures</p>
          <p>🏡 Locations</p>
          <p>⚙️ Paramètres</p>
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, padding: 40, background: "#f1f5f9" }}>
        
        <h1>Dashboard matin</h1>

        {/* URGENCES */}
        <div style={{
          background: "white",
          padding: 20,
          marginTop: 20,
          borderRadius: 8
        }}>
          <h2>🔴 Urgences</h2>

          <p>Acompte Xaloc à demander</p>
          <p>Facture EDF client Martin</p>
          <p>URSSAF client Dupont</p>
        </div>

        {/* SEMAINE */}
        <div style={{
          background: "white",
          padding: 20,
          marginTop: 20,
          borderRadius: 8
        }}>
          <h2>🟠 Cette semaine</h2>

          <p>Renouvellement assurance</p>
          <p>Contrat Mazet</p>
          <p>Relance banque</p>
        </div>

        {/* STATS */}
        <div style={{
          display: "flex",
          gap: 20,
          marginTop: 20
        }}>
          <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
            <h3>Clients</h3>
            <p style={{ fontSize: 28 }}>15</p>
          </div>

          <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
            <h3>Dossiers actifs</h3>
            <p style={{ fontSize: 28 }}>73</p>
          </div>

          <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
            <h3>Locations en cours</h3>
            <p style={{ fontSize: 28 }}>4</p>
          </div>
        </div>

      </div>
    </div>
  );
}
