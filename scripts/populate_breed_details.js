// scripts/populate_breed_details.js
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './.env.local' });

// --- 환경 변수 확인 ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
  console.error("Supabase or Gemini API Key is missing. Make sure .env.local is configured correctly.");
  process.exit(1);
}

// --- 클라이언트 초기화 ---
const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- 메인 로직 ---
async function populateBreedDetails() {
  // 1. 대상 견종 목록 가져오기
  console.log("Fetching breeds that need details...");
  const { data: allBreeds, error: allBreedsError } = await supabase
    .from('breeds')
    .select('id, name_en, name_ko');
  if (allBreedsError) {
    console.error('Error fetching all breeds:', allBreedsError.message);
    return;
  }

  const { data: existingDetails, error: existingDetailsError } = await supabase
    .from('breed_details')
    .select('breed_id');
  if (existingDetailsError) {
    console.error('Error fetching existing details:', existingDetailsError.message);
    return;
  }
  const existingBreedIds = new Set(existingDetails.map(d => d.breed_id));

  const breedsToUpdate = allBreeds.filter(b => !existingBreedIds.has(b.id));
  
  console.log(`Found ${breedsToUpdate.length} breeds to update.`);

  // 2. 각 견종에 대해 데이터 처리
  for (const breed of breedsToUpdate) {
    console.log(`\n--- Processing: ${breed.name_ko} (${breed.name_en}) ---`);
    try {
      // 3. Gemini를 사용한 데이터 수집 및 구조화
      const prompt = `
        Please provide structured data for the dog breed "${breed.name_en}".
        I need ratings (1-5, 1=low, 5=high) for the following characteristics based on typical breed standards (like AKC):
        - Adaptability
        - Friendliness with Kids
        - Friendliness with Pets
        - Trainability
        - Energy Level
        - Shedding Level
        - Grooming Needs

        Also, list up to 5 common hereditary diseases for this breed.
        For each disease, provide a short, simple description in Korean.

        Respond ONLY with a JSON object in the following format:
        {
          "details": {
            "adaptability": <rating>,
            "friendliness_with_kids": <rating>,
            "friendliness_with_pets": <rating>,
            "trainability": <rating>,
            "energy_level": <rating>,
            "shedding_level": <rating>,
            "grooming_needs": <rating>
          },
          "diseases": [
            { "disease_name": "<Korean Name>", "description": "<Korean Description>" }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const responseJson = JSON.parse(text.replace(/```json|```/g, '').trim());
      
      const { details, diseases } = responseJson;

      // 4. Supabase에 데이터 입력
      console.log(`  > Inserting details for ${breed.name_ko}...`);
      const { error: detailsError } = await supabase
        .from('breed_details')
        .insert({ breed_id: breed.id, ...details });

      if (detailsError) throw new Error(`Details insert error: ${detailsError.message}`);

      if (diseases && diseases.length > 0) {
        console.log(`  > Inserting ${diseases.length} diseases for ${breed.name_ko}...`);
        const diseaseData = diseases.map(d => ({
          breed_id: breed.id,
          disease_name: d.disease_name,
          description: d.description,
        }));
        const { error: diseasesError } = await supabase
          .from('breed_diseases')
          .insert(diseaseData);
        
        if (diseasesError) throw new Error(`Diseases insert error: ${diseasesError.message}`);
      }
      
      console.log(`  ✅ Successfully updated ${breed.name_ko}`);

    } catch (e) {
      console.error(`  ❌ Failed to process ${breed.name_ko}: ${e.message}`);
    }
    // API 과부하 방지를 위한 딜레이
    await new Promise(resolve => setTimeout(resolve, 2000)); 
  }

  console.log("\n--- All breeds processed. ---");
}

populateBreedDetails();
