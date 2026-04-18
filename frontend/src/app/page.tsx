"use client";

import { useRef, useState } from "react";
import Navbar from "@/app/components/navbar";
import DownloadButton from "@/app/components/downloadbtn";
import Features from "@/app/components/features";
import HowItWorks from "@/app/components/howitworks";
import Footer from "@/app/components/footer";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const API_URL = "https://cleanflow-ai-5r6a.onrender.com"; 
  //const API_URL = "http://127.0.0.1:8000";

  const handleChoose = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setResult(null);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/clean`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Upload failed.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Cannot connect to backend.");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

        <main className="min-h-screen pt-42 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">        
          <div className="w-full max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">CleanFlow AI</h1>

          <p className="text-lg text-slate-300 mb-10">
            Upload messy datasets and get clean, ML-ready files instantly.
          </p>

          <div className="w-full max-w-3xl mx-auto px-6 py-2">
            <div
              className={`backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] ${
                result
                  ? "bg-green-500/10"
                  : fileName
                  ? "bg-blue-500/10"
                  : "bg-white/10"
              }`}
            >
              {/* Upload Zone */}
              <div
                onClick={handleChoose}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();

                  const dropped = e.dataTransfer.files?.[0];
                  if (!dropped) return;

                  const valid =
                    dropped.name.toLowerCase().endsWith(".csv") ||
                    dropped.name.toLowerCase().endsWith(".xlsx");

                  if (!valid) {
                    setError("Only CSV or Excel (.xlsx) files are allowed.");
                    return;
                  }

                  setFile(dropped);
                  setFileName(dropped.name);
                  setError("");
                  setResult(null);
                }}
                className="border-2 border-dashed border-slate-500 hover:border-white rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 hover:bg-white/5"
              >
                <div className="text-4xl mb-3">📁</div>

                <p className="text-lg text-white font-medium truncate">
                  {fileName || "Drag & Drop your dataset"}
                </p>

                <p className="text-sm text-slate-400 mt-2">
                  Supports CSV and Excel (.xlsx)
                </p>

                <p className="text-xs text-slate-500 mt-3">
                  or click to browse files
                </p>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Action Button */}
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full mt-6 bg-white text-black font-semibold py-3 rounded-xl hover:bg-slate-200 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Cleaning Dataset..." : "Upload & Clean Data"}
              </button>

              {/* Loading */}
              {loading && (
                <div className="mt-4 text-center text-sm text-slate-300 animate-pulse">
                  Processing your file...
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Success Result */}
              {result && (
                <div className="mt-6 rounded-3xl border border-green-400/20 bg-green-500/10 p-6 backdrop-blur-xl shadow-xl">

                  {/* Header */}
                  <div className="mb-6 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-green-500 text-white flex items-center justify-center text-lg shadow-lg">
                        ✓
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white leading-tight">
                          Dataset Cleaned Successfully
                        </h3>
                        <p className="text-sm text-slate-300 leading-tight">
                          Your ML-ready file is prepared and ready to download.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        File Name
                      </p>
                      <p className="text-white font-medium truncate mt-1">
                        {result.filename}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Rows Removed
                      </p>
                      <p className="text-white text-2xl font-bold mt-1">
                        {result.rows_cleaned}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Initial Rows
                      </p>
                      <p className="text-white text-2xl font-bold mt-1">
                        {result.initial_rows}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Final Rows
                      </p>
                      <p className="text-white text-2xl font-bold mt-1">
                        {result.final_rows}
                      </p>
                    </div>
                  </div>

                  {/* AI Report */}
                  {result?.ai_report?.trim() && (
                    <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5 text-left shadow-inner">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-400 text-lg">✨</span>
                        <h4 className="text-sm uppercase tracking-wide font-semibold text-green-400">
                          AI Cleaning Insights
                        </h4>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {result.ai_report}
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-6 flex justify-center">
                    <DownloadButton href={`${API_URL}${result.download_url}`} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Additional Sections */}
        <Features />
        <HowItWorks />
        <Footer />
      </main>
    </>
  );
}