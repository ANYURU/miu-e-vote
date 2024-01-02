const createSupabaseClient = (supabaseKey, supabaseUrl) =>
  supabase.createClient(supabaseKey, supabaseUrl);

export default createSupabaseClient;
