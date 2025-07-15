// src/app/api/summarise/route.ts

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import unfluff from 'unfluff';

// Load environment variables
const mongoUri = process.env.MONGO_URI as string;
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;

// Ensure all required env vars exist
if (!mongoUri || !supabaseUrl || !supabaseKey) {
  throw new Error("Missing required environment variables");
}

// Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    // 👉 Fetch blog content from URL
    const response = await fetch(url);
    const html = await response.text();
    const data = unfluff(html);
    const fullText = data.text || 'Unable to extract blog content.';

    // 👉 Generate a basic summary (first 2 sentences)
    const summary = fullText.split('. ').slice(0, 2).join('. ') + '.';

    // Urdu translation map
    const urduMap: Record<string, string> = {
      'clean UI': 'صاف یوزر انٹرفیس',
      'modern web applications': 'جدید ویب ایپلیکیشنز',
      importance: 'اہمیت',
    };

    // Translate to Urdu
    let urdu = summary;
    for (const key in urduMap) {
      urdu = urdu.replace(new RegExp(key, 'gi'), urduMap[key]);
    }

    // 👉 Save summary to Supabase
    const { error: supabaseError } = await supabase
      .from('summaries')
      .insert([{ url, summary, urdu_summary: urdu }]);

    if (supabaseError) throw new Error(`Supabase error: ${supabaseError.message}`);

    // 👉 Save full blog to MongoDB
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('blogSummariser');
    await db.collection('blogs').insertOne({ url, fullText });
    await client.close();

    // ✅ Success response
    return NextResponse.json({ summary, urdu });
  } catch (err) {
    const error = err as Error;
    console.error('[API Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
