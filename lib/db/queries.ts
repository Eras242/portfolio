import { supabase } from "../supabase/client";

// Example database query functions
// Customize these based on your database schema

/**
 * Generic function to fetch all rows from a table
 */
export async function getAllFromTable<T>(tableName: string) {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    throw error;
  }

  return data as T[];
}

/**
 * Generic function to fetch a single row by ID
 */
export async function getById<T>(tableName: string, id: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching ${tableName} by id:`, error);
    throw error;
  }

  return data as T;
}

/**
 * Generic function to insert a new row
 */
export async function insertRow<T>(tableName: string, row: Partial<T>) {
  const { data, error } = await supabase
    .from(tableName)
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    throw error;
  }

  return data as T;
}

/**
 * Generic function to update a row by ID
 */
export async function updateRow<T>(
  tableName: string,
  id: string,
  updates: Partial<T>
) {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating ${tableName}:`, error);
    throw error;
  }

  return data as T;
}

/**
 * Generic function to delete a row by ID
 */
export async function deleteRow(tableName: string, id: string) {
  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) {
    console.error(`Error deleting from ${tableName}:`, error);
    throw error;
  }

  return true;
}
