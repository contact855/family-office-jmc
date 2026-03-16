const http = require('http');

const SUPABASE_URL = "https://mjvimzxsfjlkhrzdsqah.supabase.co";
const SUPABASE_KEY = "sb_publishable_qYTDpvLvStqrTHzPg8ROMQ_Hdolar6x";

async function getClients() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/entites?select=*`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });
  return await res.json();
}

async function getDossiers() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/dossiers?select=*`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });
  return await res.json();
}

const server = http.createServer(async (req, res) => {
  const clients = await getClients();
  const dossiers = await getDossiers();

  const html = `
  <html>
  <head>
    <title>Family Office JMC</title>
    <style>
      body { font-family: Arial; padding: 40px; background: #f4f4f4; }
      .card { background: white; padding: 20px; margin-bottom: 10px; border-radius: 8px; }
    </style>
  </head>
  <body>
    <h1>Family Office – JMC</h1>

    <h2>Clients</h2>
    ${clients.map(c => `<div class="card">${c.nom}</div>`).join("")}

    <h2>Dossiers</h2>
    ${dossiers.map(d => `<div class="card">${d.nom}</div>`).join("")}

  </body>
  </html>
  `;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(3000);
