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
    <div className="flex flex-col items-center min-h-screen bg-base-100 pt-10 px-4">
      <div className="max-w-3xl w-full text-center">
        <Image
          src="/favicon.png"
          alt="redhead"
          width={200}
          height={75}
          className="mx-auto rounded-xl border-4 border-primary mb-8"
        />

        <h1 className="text-4xl font-bold mb-2 text-primary">Welcome to the Copperati</h1>
        <h2 className="text-lg text-large text-neutral-content mb-6">
          A secret society of radiant shades & rare DNA
        </h2>
        <p className="text-lg text-primary mb-6">
          Dedicated to the beauty of science
        </p>

        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full mb-4"
          />

          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="mx-auto rounded-lg max-h-64"
              />
            </div>
          )}

          <button
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={handleAnalyze}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          {error && (
            <div className="mt-4 text-red-400 bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 bg-base-300 p-4 rounded-xl text-left">
              <h2 className="text-xl font-bold text-secondary mb-2">
                Match: {result.shadeName}
              </h2>
              <p className="mb-2 text-base-content">{result.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border border-neutral"
                    style={{ backgroundColor: result.hex }}
                  />
                  <span className="text-sm">Match: {result.hex}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border border-neutral"
                    style={{ backgroundColor: result.sampledHex }}
                  />
                  <span className="text-sm">Sampled: {result.sampledHex}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
