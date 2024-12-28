import { createClient } from "jsr:@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id, date, calories, water_ml, steps, photo_url } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data, error } = await supabaseClient.from('health_metrics').insert([
      { user_id, date, calories, water_ml, steps, photo_url }
    ]).select().single();

    if (error) {
      throw new Error(`Failed to create health metric: ${error.message}`);
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in createHealthMetric function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}); 