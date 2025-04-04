"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const Home = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unknown error");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#FFF1E6] via-[#FDE5D4] to-[#F9CBA7] pt-10 px-4">
      <div className="max-w-3xl w-full text-center">
        <Image
          src="/favicon.png"
          alt="redhead"
          width={200}
          height={75}
          className="mx-auto rounded-xl border-4 border-primary mb-8"
        />

        <h1 className="text-4xl font-bold mb-2 text-primary">Welcome to the Copperati</h1>
        <h2 className="text-lg text-large text-neutral-content mb-4">
          A secret society of radiant shades & rare DNA
        </h2>
        <p className="text-lg text-primary mb-6">
          Dedicated to the beauty of science
        </p>

        <div className="bg-white/70 p-6 rounded-xl shadow-xl">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.HEIC"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full mb-4"
          />

          {imagePreview && (
            <div className="mb-6">
              <div className="w-64 h-64 mx-auto rounded-full border-4 border-[#C9694A] shadow-xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {imagePreview && !result && (
            <button
              className="btn btn-primary w-full"
              disabled={loading}
              onClick={handleAnalyze}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          )}

          {result && (
  <div className="mt-8 bg-[#FFF4EE] border border-[#EDA57C] rounded-2xl p-8 shadow-xl max-w-md mx-auto text-center">
    <h2 className="text-3xl font-extrabold text-[#D64527] mb-4 tracking-wide">
      ✨ Copperati ✨
    </h2>

    <p className="text-2xl font-bold text-[#2C2C2C] mb-1">{result.name}</p>

    {/* Optional: add an emoji or flare later based on tone type */}
    
    {/* Color Circle */}
    <div className="my-4">
      <div
        className="w-24 h-24 rounded-full border-4 border-neutral shadow-lg mx-auto"
        style={{ backgroundColor: result.hex }}
      />
      <span className="mt-2 block text-sm font-mono text-[#888]">
        {result.hex}
      </span>
    </div>

    {/* Optional subtext */}
    {result.description && (
      <p className="italic text-sm text-[#666] mt-2">
        {result.description}
      </p>
    )}
  </div>
)}


          {error && (
            <div className="mt-4 text-red-400 bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
