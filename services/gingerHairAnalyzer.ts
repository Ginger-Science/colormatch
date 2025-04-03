import sharp from "sharp";

export async function getAverageHairColor(imageBuffer: Buffer): Promise<string> {
  const { data, info } = await sharp(imageBuffer)
    .resize(100, 100)
    .raw()
    .toBuffer({ resolveWithObject: true });

  let r = 0, g = 0, b = 0;
  const pixelCount = info.width * info.height;

  for (let i = 0; i < data.length; i += 3) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  const rAvg = Math.round(r / pixelCount);
  const gAvg = Math.round(g / pixelCount);
  const bAvg = Math.round(b / pixelCount);

  return rgbToHex(rAvg, gAvg, bAvg);
}

export function matchToGingerShade(hex: string) {
  const gingerShades = [
    { id: "8.4", name: "Light Copper Blonde", hex: "#EDA57C", description: "A true light copper tone with soft vibrancy." },
    { id: "9.4", name: "Very Light Copper Blonde", hex: "#F8BF9A", description: "A soft strawberry blonde with dimension." },
    { id: "7.4", name: "Medium Copper", hex: "#C9694A", description: "Classic midtone redhead shade with depth." },
    { id: "6.46", name: "Dark Copper Red", hex: "#A9402C", description: "Rich auburn tones with dark copper intensity." },
  ];

  const matched = gingerShades.reduce((closest, shade) => {
    const dist = colorDistance(hex, shade.hex);
    return dist < closest.dist ? { ...shade, dist } : closest;
  }, { id: "", name: "", hex: "", description: "", dist: Infinity });

  return matched;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function colorDistance(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}
