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
    const url = new URL(req.url);
    const roleId = url.searchParams.get('id');

    if (!roleId) {
      return new Response(JSON.stringify({ error: "Role ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error } = await supabaseClient.from('user_roles').delete().eq('role_id', roleId);

    if (error) {
      throw new Error(`Failed to delete role: ${error.message}`);
    }

    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error in deleteRole function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}); 