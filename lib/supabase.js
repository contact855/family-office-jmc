import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mjvimzxsfjlkhrzdsqah.supabase.co";
const supabaseKey = "sb_publishable_qYTDpvLvStqrTHzPg8ROMQ_Hdolar6x";

export const supabase = createClient(supabaseUrl, supabaseKey);
