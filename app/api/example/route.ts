import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Example API route showing how to use Supabase on the server
export async function GET() {
  try {
    const supabase = await createServerClient();
    
    // Example query - replace with your actual table name
    // const { data, error } = await supabase
    //   .from('your_table')
    //   .select('*');
    
    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 500 });
    // }
    
    return NextResponse.json({ 
      message: "Supabase is connected!",
      // data: data 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to Supabase" },
      { status: 500 }
    );
  }
}
