import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

async function getOverwatchHeroes() {
  const response = await axios.get(
    "https://overfast-api.tekrop.fr/heroes?locale=ko-kr"
  );
  return response.data;
}

export async function GET(req: NextRequest) {
  try {
    const heroes = await getOverwatchHeroes();
    return NextResponse.json(heroes, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET handler:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}