import { HeroType } from "@/types/hero.type";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchHero = async () : Promise<HeroType[]> => {
  const response = await axios.get(
    `${BASE_URL}/api/overwatch/heroes`
  );
  const data = await response.data;
  return data;
};