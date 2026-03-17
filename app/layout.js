export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{
        margin: 0,
        fontFamily: "Inter, system-ui",
        background: "#f5f7fa"
      }}>
        {children}
      </body>
    </html>
  );
}
