// scripts/seedWithDogAPI.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const { Translate } = require('@google-cloud/translate').v2;

// --- 💡 API 키 설정 ---
const DOG_API_KEY = "live_JDNUUrFz9FtBTi6hD2GoAjC1wNrEFKihQmTqoKeKf1Af3ag4cC47twq90VuZ33B5";
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY; // .env.local에서 가져옴

const DOG_API_URL = "https://api.thedogapi.com/v1";

// --- Google Translate 클라이언트 초기화 ---
const translate = new Translate({ key: GOOGLE_TRANSLATE_API_KEY });

async function translateText(text, target = 'ko') {
  if (!text) return "";
  try {
    let [translations] = await translate.translate(text, target);
    return Array.isArray(translations) ? translations[0] : translations;
  } catch (error) {
    console.error("Translation Error:", error.message);
    return text; // 번역 실패 시 원문 반환
  }
}

async function seedData() {
  // 1. Supabase 클라이언트 초기화
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey || !GOOGLE_TRANSLATE_API_KEY) {
    console.error("API Keys or Supabase URL is missing. Check your .env.local file.");
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 2. The Dog API에서 데이터 가져오기
    console.log("🐶 Fetching breeds from The Dog API...");
    const response = await axios.get(`${DOG_API_URL}/breeds`, {
      headers: { 'x-api-key': DOG_API_KEY }
    });
    const breedsFromAPI = response.data;
    console.log(`✅ Found ${breedsFromAPI.length} breeds.`);

    // 3. 데이터 가공 및 번역
    console.log("🛠️  Processing and translating data...");
    const breedsToUpsert = [];
    for (const breed of breedsFromAPI) {
      const [name_ko, summary_ko, history_ko] = await Promise.all([
        translateText(breed.name),
        translateText(breed.temperament),
        translateText(breed.origin)
      ]);
      
      const [minWeight, maxWeight] = (breed.weight.metric || "0 - 0").split(" - ").map(Number);
      const [minLife, maxLife] = (breed.life_span || "0 - 0").replace(" years", "").split(" - ").map(Number);

      breedsToUpsert.push({
        name_en: breed.name,
        name_ko: name_ko || breed.name,
        thumbnail_url: breed.image?.url,
        summary: summary_ko || breed.temperament,
        history: history_ko || breed.origin || "N/A",
        avg_weight: `[${minWeight || 0},${maxWeight || minWeight || 0})`,
        avg_life_expectancy: `[${minLife || 0},${maxLife || minLife || 0})`,
      });
      console.log(`- Translated: ${breed.name} -> ${name_ko}`);
    }
    
    // 4. Supabase에 데이터 Upsert
    console.log(`🔄 Upserting ${breedsToUpsert.length} breeds to Supabase...`);
    const { error } = await supabase
      .from('breeds')
      .upsert(breedsToUpsert, { onConflict: 'name_en' });

    if (error) {
      console.error("❌ Error upserting data:", error);
    } else {
      console.log("✅ Successfully upserted all translated data to Supabase!");
    }

  } catch (error) {
    console.error("❌ An unexpected error occurred:", error.message);
  }
}

seedData();