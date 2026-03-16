const http = require('http');
const url = require('url');

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

async function getDossiers(entite_id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/dossiers?entite_id=eq.${entite_id}`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });
  return await res.json();
}

const server = http.createServer(async (req, res) => {
  const query = url.parse(req.url, true).query;
  const clients = await getClients();

  if (query.client) {
    const dossiers = await getDossiers(query.client);

    const html = `
    <html>
    <body style="font-family:Arial;padding:40px">
      <h1>Dossiers client</h1>
      ${dossiers.map(d => `<div>${d.nom}</div>`).join("")}
      <br><a href="/">← retour</a>
    </body>
    </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  const html = `
  <html>
  <body style="font-family:Arial;padding:40px">
    <h1>Family Office JMC</h1>
    ${clients.map(c => `<div><a href="?client=${c.id}">${c.nom}</a></div>`).join("")}
  </body>
  </html>
  `;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(3000);
