// src/app/api/summarise/route.ts

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { createClient } from '@supabase/supabase-js';
import { extract } from '@extractus/article-extractor';

// Load environment variables
const mongoUri = process.env.MONGO_URI as string;
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    // 👉 Extract blog content using article-extractor
    const article = await extract(url);
    const fullText = article?.content?.replace(/<[^>]+>/g, '') || 'Unable to extract blog content.';

    // 👉 Generate a basic summary (first 2 sentences)
    const summary = fullText.split('. ').slice(0, 2).join('. ') + '.';

    // Urdu translation map
    const urduMap: Record<string, string> = {
      'clean UI': 'صاف یوزر انٹرفیس',
      'modern web applications': 'جدید ویب ایپلیکیشنز',
      importance: 'اہمیت',
    };

    let urdu = summary;
    for (const key in urduMap) {
      urdu = urdu.replace(new RegExp(key, 'gi'), urduMap[key]);
    }

    // 👉 Save summary to Supabase
    const { error: supabaseError } = await supabase
      .from('summaries')
      .insert([{ url, summary, urdu_summary: urdu }]);

    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    // 👉 Save full blog to MongoDB
    const client = new MongoClient(mongoUri, {
  ssl: true
});


    await client.connect();
    const db = client.db('blogSummariser');
    await db.collection('blogs').insertOne({ url, fullText });
    await client.close();

    return NextResponse.json({ summary, urdu });
  } catch (err: any) {
    console.error('[API Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
