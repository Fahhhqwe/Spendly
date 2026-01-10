import { createClient } from "@supabase/supabase-js";
import { env } from './env';

const supabaseUrl = env.SUPABASE_URL!;
const supabaseKey = env.SUPABASE_KEY!;
export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseKey
);
