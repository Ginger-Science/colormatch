"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";

const Home = () => {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [clickCoords, setClickCoords] = useState(null);
  const [consent, setConsent] = useState(false);

  const { address, isConnected } = useAccount();
  const { data: vendorContractData } = useDeployedContractInfo("Vendor");
  const { writeContractAsync: writeVendorAsync } = useScaffoldWriteContract("Vendor");

  const handleFileChange = (e) => {
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
    } catch (err) {
      setError(err.message || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const handleClickOnImage = (e) => {
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
    const hex = `#${[pixel[0], pixel[1], pixel[2]].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
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

  const handleClaimMc1r = async () => {
    try {
      await writeVendorAsync({ functionName: "buyTokens", value: 0 });
    } catch (err) {
      console.error("Error calling buyTokens function", err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-base-100 text-base-content pt-10 px-4">
      <div className="max-w-3xl w-full text-center">
        <Image src="/hero.png" alt="redhead" width={200} height={75} className="mx-auto rounded-xl mb-8" />

        <h1 className="text-4xl font-bold mb-2 text-primary">What is your shade?</h1>
        <h2 className="text-lg text-large text-neutral-content mb-4">Explore the spectrum of Ginger hair colors</h2>
        <h2 className="text-lg text-large text-neutral-content mb-4">Upload an image of red hair to get a hex match!</h2>

        <div className="bg-base-200 p-6 rounded-xl shadow-xl">
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
                    style={{ top: `${clickCoords.y}px`, left: `${clickCoords.x}px`, transform: "translate(-50%, -50%)" }}
                  />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              {!result && (
                <p className="text-base font-bold text-red-600 mt-4">🔥 HOT SPOT: Click where the ginger burns brightest</p>
              )}
            </div>
          )}

          {imagePreview && !result && (
            <>
              <div className="flex items-center justify-center gap-2 mb-4 text-sm text-neutral-content">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="checkbox border-white bg-white dark:border-white dark:bg-white"
                />
                <label htmlFor="consent">
                  I agree to the <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</Link> and <Link href="/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</Link>
                </label>
              </div>
              <button
                className="btn btn-secondary w-full"
                disabled={loading || !consent}
                onClick={handleAnalyze}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </>
          )}

          {result && (
            <div className="mt-8 bg-base-100 border border-[#EDA57C] rounded-2xl p-8 shadow-xl max-w-md mx-auto text-center">
              <p className="text-2xl font-bold text-primary mb-1">{result.name}</p>

              <div className="my-4">
                <div className="w-24 h-24 rounded-full border-4 border-neutral shadow-lg mx-auto" style={{ backgroundColor: result.hex }} />
                <span className="mt-2 block text-sm font-mono text-neutral-content">{result.hex}</span>
              </div>

              {result.description && (
                <p className="italic text-sm text-neutral-content mt-2">{result.description}</p>
              )}

              {/* MC1R Reward Section */}
              {isConnected ? (
                <div className="flex flex-col items-center space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8">
                  <div className="text-xl">Claim MC1R Token Reward</div>
                  <button className="btn btn-secondary" onClick={handleClaimMc1r}>
                    Claim MC1R
                  </button>
                </div>
              ) : (
                <div className="mt-6 text-center text-sm text-warning">Please connect your wallet to claim your MC1R reward.</div>
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