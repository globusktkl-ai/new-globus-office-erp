// Supabase JS Library CDN Import
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ==========================================
// ശ്രദ്ധിക്കുക: താഴെ പറയുന്ന രണ്ട് വരികളിൽ നിങ്ങളുടെ 
// യഥാർത്ഥ Supabase URL, ANON KEY എന്നിവ നൽകണം.
// (Supabase Dashboard -> Settings -> API എന്നതിൽ നിന്നും ഇവ ലഭിക്കും)
// ==========================================

const supabaseUrl = 'https://kwrugdbrzrfbmibaccwr.supabase.co';
const supabaseKey = 'sb_publishable_Pf_pB13Hv4ycYmNSiD75XQ_cT0b5eOM';

// Initialize and Export Supabase Client
export const supabase = createClient(supabaseUrl, supabaseKey);
