import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
const mongoUri = process.env.MONGO_URI!;
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

// Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

type RequestBody = {
  url: string;
};

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Simulated blog full text and summary
    const fullText = `This is a placeholder for full blog text from URL: ${url}`;
    const summary =
      "This blog discusses the importance of clean UI in modern web applications.";

    // Urdu translation
    const urduMap: Record<string, string> = {
      "clean UI": "صاف یوزر انٹرفیس",
      "modern web applications": "جدید ویب ایپلیکیشنز",
      importance: "اہمیت",
    };

    let urdu = summary;
    for (const key in urduMap) {
      urdu = urdu.replace(new RegExp(key, "gi"), urduMap[key]);
    }

    // Save summary in Supabase
    const { error: supabaseError } = await supabase
      .from("summaries")
      .insert([{ url, summary, urdu_summary: urdu }]);

    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    // Save full blog text in MongoDB
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db("blogSummariser");
    await db.collection("blogs").insertOne({ url, fullText });
    await client.close();

    return NextResponse.json({ summary, urdu });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    console.error("[API ERROR]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
