"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarise = async () => {
    if (!url) return;
    setLoading(true);
    setSummary("");
    setTranslated("");

    try {
      const res = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setSummary(data.summary);
      setTranslated(data.urdu_summary);
    } catch (error) {
      console.error("Failed to summarise:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">📝 Blog Summariser</h1>

      <Input
        type="text"
        placeholder="Enter blog URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={handleSummarise} disabled={loading} className="w-full">
        {loading ? "Summarising..." : "Summarise"}
      </Button>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      )}

      {!loading && summary && (
        <motion.div
          className="p-4 rounded-lg bg-gradient-to-r from-indigo-200 to-purple-300 shadow-lg space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold">📌 Summary</h2>
          <p>{summary}</p>

          <h2 className="text-xl font-semibold mt-4">🌐 اردو ترجمہ</h2>
          <p className="font-urdu">{translated}</p>
        </motion.div>
      )}
    </main>
  );
}
