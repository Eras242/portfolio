"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

/**
 * Example component showing how to use Supabase on the client side
 * This is a template - customize based on your needs
 */
export default function SupabaseExample() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Example query - replace with your actual table name
      // const { data, error } = await supabase
      //   .from('your_table')
      //   .select('*');
      
      // if (error) throw error;
      // setData(data || []);
      
      // For now, just show connection status
      setData([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Supabase Connection Status</h2>
      <p>Connected successfully! Ready to query your database.</p>
      {/* Render your data here */}
    </div>
  );
}
