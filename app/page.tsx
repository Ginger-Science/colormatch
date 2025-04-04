"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [clickCoords, setClickCoords] = useState<{ x: number; y: number } | null>(null);
  const [consent, setConsent] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setSelectedColor(null);
      setClickCoords(null);
    }
  };

  const handleAnalyze = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !consent) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);
    if (selectedColor) formData.append("hexOverride", selectedColor);

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
      setClickCoords(null);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const handleClickOnImage = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${[pixel[0], pixel[1], pixel[2]]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")}`;
    setSelectedColor(hex);
    setClickCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleReset = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    setSelectedColor(null);
    setClickCoords(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setConsent(false);
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
          {!result && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.HEIC"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full mb-4"
            />
          )}

          {result && (
            <button
              onClick={handleReset}
              className="w-10 h-10 rounded-full bg-[#C9694A] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg"
              title="Try again"
            >
              +
            </button>
          )}

          {imagePreview && (
            <div className="mb-6 relative">
              <div className="w-64 h-64 mx-auto rounded-full border-4 border-[#C9694A] shadow-xl overflow-hidden relative">
                <img
                  ref={imgRef}
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover cursor-crosshair"
                  onClick={handleClickOnImage}
                />
                {clickCoords && (
                  <div
                    className="absolute w-4 h-4 rounded-full border-2 border-white bg-white pointer-events-none"
                    style={{
                      top: `${clickCoords.y}px`,
                      left: `${clickCoords.x}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              {!result && (
                <p className="text-base font-bold text-red-600 mt-4">
                  🔥 HOT SPOT: Click where the ginger burns brightest
                </p>
              )}
            </div>
          )}

          {imagePreview && !result && (
            <>
              <div className="flex items-center justify-center gap-2 mb-4 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <label htmlFor="consent">
                  I agree to the {" "}
                  <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</Link>{" "}
                  and {" "}
                  <Link href="/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</Link>
                </label>
              </div>
              <button
                className="btn btn-primary w-full"
                disabled={loading || !consent}
                onClick={handleAnalyze}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </>
          )}

          {result && (
            <div className="mt-8 bg-[#FFF4EE] border border-[#EDA57C] rounded-2xl p-8 shadow-xl max-w-md mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-[#D64527] mb-4 tracking-wide">
                ✨ Copperati ✨
              </h2>

              <p className="text-2xl font-bold text-[#2C2C2C] mb-1">{result.name}</p>

              <div className="my-4">
                <div
                  className="w-24 h-24 rounded-full border-4 border-neutral shadow-lg mx-auto"
                  style={{ backgroundColor: result.hex }}
                />
                <span className="mt-2 block text-sm font-mono text-[#888]">
                  {result.hex}
                </span>
              </div>

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
