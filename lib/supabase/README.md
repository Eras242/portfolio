# Supabase Setup Guide

## Getting Started

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project or use an existing one

2. **Get Your API Keys**
   - Go to your project settings → API
   - Copy your Project URL and anon/public key

3. **Set Up Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

## Usage

### Client-Side (Browser)
```typescript
import { supabase } from '@/lib/supabase/client';

// Example: Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*');
```

### Server-Side (Server Components, API Routes)
```typescript
import { createServerClient } from '@/lib/supabase/server';

// In a Server Component or API Route
const supabase = await createServerClient();

const { data, error } = await supabase
  .from('your_table')
  .select('*');
```

### Using Query Helpers
```typescript
import { getAllFromTable, getById, insertRow } from '@/lib/db/queries';

// Fetch all rows
const items = await getAllFromTable('your_table');

// Fetch by ID
const item = await getById('your_table', 'item-id');

// Insert new row
const newItem = await insertRow('your_table', { name: 'New Item' });
```

## Generating TypeScript Types

To generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

Or install Supabase CLI and use:
```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

## Storage Setup (For Videos)

1. **Create a Storage Bucket**
   - Go to your Supabase project → Storage
   - Click "New bucket"
   - Name it `videos` (or update the bucket name in `app/page.tsx`)
   - Make it **Public** (so videos can be accessed without authentication)

2. **Upload Your Videos**
   - Click on your `videos` bucket
   - Upload `desktopVideo.mp4` and `mobileVideo.mp4`
   - Make sure the file names match exactly (case-sensitive)

3. **Set Storage Policies (if needed)**
   - Go to Storage → Policies
   - For public access, you may need to create a policy that allows public read access
   - Example policy: "Allow public read access" with SELECT permission for everyone

## Next Steps

1. Create your database tables in Supabase Dashboard
2. Set up Row Level Security (RLS) policies
3. Set up Storage buckets and policies for your videos
4. Generate TypeScript types for your schema
5. Create custom query functions in `lib/db/queries.ts`
