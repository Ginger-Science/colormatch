import { NextRequest, NextResponse } from "next/server";
import { getAverageHairColor, matchToGingerShade } from "../../../services/gingerHairAnalyzer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");
    const hexOverride = formData.get("hexOverride");

    if (!(imageFile instanceof File)) {
      return NextResponse.json({ error: "No valid image provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const hexColor =
      typeof hexOverride === "string" && /^#[0-9A-Fa-f]{6}$/.test(hexOverride)
        ? hexOverride
        : await getAverageHairColor(buffer);

    const match = matchToGingerShade(hexColor);

    return NextResponse.json({
      sampledHex: hexColor,
      ...match,
    });
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json({ error: "Image analysis failed" }, { status: 500 });
  }
}
