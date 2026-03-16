const http = require('http');

const html = `
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Family Office – JMC</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; background:#f5f6f7; color:#222; }
  header { background:#fff; padding:16px 24px; border-bottom:1px solid #e5e7eb; }
  h1 { margin:0; font-size:20px; }
  main { padding:24px; }
  .card { background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:16px; margin-bottom:16px; }
  .grid { display:grid; grid-template-columns:1fr; gap:16px; }
  @media(min-width:900px){ .grid { grid-template-columns:1fr 1fr; } }
</style>
</head>
<body>
<header>
  <h1>Family Office – JMC</h1>
</header>
<main>
  <div class="grid">
    <div class="card">
      <h2>Tableau de bord</h2>
      <p>Bienvenue. L’interface V1 est en cours d’activation.</p>
    </div>
    <div class="card">
      <h2>Clients</h2>
      <p>La gestion des clients sera visible ici.</p>
    </div>
    <div class="card">
      <h2>Tâches</h2>
      <p>Les tâches et rappels apparaîtront ici.</p>
    </div>
    <div class="card">
      <h2>Factures</h2>
      <p>Le module factures sera activé ensuite.</p>
    </div>
  </div>
</main>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log('Server running on ' + port));
