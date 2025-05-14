import sharp from "sharp";
import chroma from "chroma-js";
import { writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export async function getAverageHairColor(imageBuffer: Buffer): Promise<string> {
  const tempPath = join(tmpdir(), `input-${Date.now()}.jpg`);
  writeFileSync(tempPath, imageBuffer);

  try {
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
  } catch (error) {
    console.error("Color extraction failed.", error);
    return "#000000";
  }
}

export function matchToGingerShade(hex: string) {
  const naturalShades = expandedGingerShades.filter(s => s.id.startsWith("N"));
  const fashionShades = expandedGingerShades.filter(s => s.id.startsWith("F"));

  const naturalMatch = matchColor(hex, naturalShades);
  const fashionMatch = matchColor(hex, fashionShades);

  const matched = fashionMatch.dist + 5 < naturalMatch.dist ? fashionMatch : naturalMatch;
  return matched;
}

function matchColor(hex: string, shadeGroup: typeof expandedGingerShades) {
  return shadeGroup.reduce((closest, shade) => {
    const dist = chroma.deltaE(hex, shade.hex);
    return dist < closest.dist ? { ...shade, dist } : closest;
  }, { id: "", name: "", hex: "", description: "", dist: Infinity });
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

const expandedGingerShades = [
  { id: "N1", name: "Foxglove Flame", hex: "#B5532A", description: "Glows like a trickster in moonlight." },
  { id: "N2", name: "Sienna Cipher", hex: "#A6452A", description: "Wears secrets like perfume." },
  { id: "N3", name: "Copper Current", hex: "#C05634", description: "Always in motion, never fades." },
  { id: "N4", name: "Ashen Flame", hex: "#B75540", description: "Soft but never pale." },
  { id: "N5", name: "Rust Whisper", hex: "#AD4F32", description: "Muted but unmistakable." },
  { id: "N6", name: "Emberleaf", hex: "#B34529", description: "Blush of fall in every strand." },
  { id: "N7", name: "Cedar Spark", hex: "#A54830", description: "Bright in the shadows." },
  { id: "N8", name: "Torchwood", hex: "#9E3E24", description: "Smolders in silence." },
  { id: "N9", name: "Brass Pact", hex: "#C65B3A", description: "For those in the know." },
  { id: "N10", name: "Honeyed Copper", hex: "#D6754A", description: "Sweet with a kick." },
  { id: "N11", name: "Copperfield", hex: "#CE6839", description: "Now you see it, now you’re obsessed." },
  { id: "N12", name: "Cinder Gleam", hex: "#B0522F", description: "Lowkey glow-up." },
  { id: "N13", name: "Ginger Noir", hex: "#803A29", description: "Darkest before the spark." },
  { id: "N14", name: "Bronze Glint", hex: "#BA6E4A", description: "A warrior’s tanline." },
  { id: "N15", name: "Harvest Flicker", hex: "#CB6A4C", description: "Limited seasonal edition: you." },
  { id: "N16", name: "Clove Burn", hex: "#933D24", description: "Spicy and spellbound." },
  { id: "N17", name: "Cinnamon Shade", hex: "#C2643E", description: "Snuck into the spice rack." },
  { id: "N18", name: "Redacted Radiance", hex: "#AA4C2C", description: "Too classified to describe." },
  { id: "N19", name: "Witch Hazel", hex: "#B64E35", description: "Not your average plant-based healing." },
  { id: "N20", name: "Secret Sauce", hex: "#D06C49", description: "Don’t ask. Just wear it." },
  { id: "N21", name: "Maple Shiver", hex: "#D37C59", description: "Just enough chill to be hot." },
  { id: "N22", name: "Terracotta Myth", hex: "#B85739", description: "Ancient. Legendary. Yours." },
  { id: "N23", name: "Redwood Wink", hex: "#A74830", description: "Tall, confident, quiet power." },
  { id: "N24", name: "Wheatflare", hex: "#EAA07C", description: "Barely red, clearly chosen." },
  { id: "N25", name: "Candle Glow", hex: "#E7B290", description: "Soft illumination from within." },
  { id: "N26", name: "Golden Blush", hex: "#F2BA97", description: "The rare kind of blonde that burns." },
  { id: "N27", name: "Sunpetal Fade", hex: "#F4C6A7", description: "The lightest of the strawberry elite." },
  { id: "N28", name: "Coral Drift", hex: "#FABFA5", description: "Blown in by ocean air and chaos." },
  { id: "N29", name: "Porcelain Flame", hex: "#FAE3D5", description: "So pale, it flickers." },
  { id: "N30", name: "Ivory Flicker", hex: "#FCE9DC", description: "A rare, incandescent hush." },
  { id: "F1", name: "Rose Gold Rush", hex: "#E5A29C", description: "Instagram made her famous." },
  { id: "F2", name: "Neon Coral", hex: "#FF7260", description: "Ginger but make it electric." },
  { id: "F3", name: "Pink Flame", hex: "#FF9C9C", description: "Bubblegum with heat." },
  { id: "F4", name: "Cantaloupe Crush", hex: "#FFA07A", description: "If your hair had brunch plans." },
  { id: "F5", name: "Ginger Mojito", hex: "#E38C75", description: "Minty peach for risk-takers." },
  { id: "F6", name: "Frosted Amber", hex: "#FFDAC8", description: "Winterized for impact." },
  { id: "F7", name: "Digital Rust", hex: "#B95E5E", description: "An NFT in hair form." },
  { id: "F8", name: "Cinnamon Pop", hex: "#D76B53", description: "The influencer version of copper." },
  { id: "F9", name: "Peach Whip", hex: "#FFD8CB", description: "Whipped and weirdly wonderful." },
  { id: "F10", name: "Sepia Bloom", hex: "#BA7967", description: "Retro rebellion." },
  { id: "F11", name: "Sunset Edit", hex: "#FFBE98", description: "Filtered and fabulous." },
  { id: "F12", name: "Copper Couture", hex: "#D67C5C", description: "Red carpet & runway ready." }
];
