export function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
      <aside style={{
        width: 240,
        background: "#111",
        color: "white",
        padding: 20
      }}>
        <h2>Family Office</h2>
        <nav style={{ marginTop: 30 }}>
          <p>Dashboard</p>
          <p>Clients</p>
          <p>Dossiers</p>
          <p>Tâches</p>
          <p>Factures</p>
          <p>Documents</p>
          <p>Locations</p>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 40 }}>
        {children}
      </main>
    </div>
  );
}
