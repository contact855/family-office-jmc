import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { data } = await supabase.from("taches").select("*");

  const today = new Date();

  let retards = 0;
  let urgences = 0;

  (data || []).forEach(t => {
    if (!t.date_echeance) return;

    const d = new Date(t.date_echeance);
    const diff = (d - today) / (1000 * 60 * 60 * 24);

    if (d < today) retards++;
    else if (diff <= 3) urgences++;
  });

  if (retards === 0 && urgences === 0) {
    return res.status(200).send("No alerts");
  }

  await resend.emails.send({
    from: "Family Office <onboarding@resend.dev>",
    to: "contact@cgconseils.info",
    subject: "Alertes cabinet",
    html: `
      <h2>Alertes cabinet</h2>
      <p>Retards : ${retards}</p>
      <p>Urgences : ${urgences}</p>
    `
  });

  res.status(200).send("Email sent");
}
