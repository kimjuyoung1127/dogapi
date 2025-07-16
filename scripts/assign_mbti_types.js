// scripts/assign_mbti_types.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

// --- 환경 변수 확인 ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Service Key is missing.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- MBTI 추론 로직 ---
function inferMbti(details) {
  if (!details) return null;

  let mbti = "";

  // E (외향) vs I (내향)
  mbti += (details.energy_level >= 4 && details.friendliness_with_kids >= 4) ? 'E' : 'I';

  // S (감각) vs N (직관)
  mbti += (details.trainability <= 3 && details.adaptability >= 3) ? 'S' : 'N';

  // T (사고) vs F (감정)
  mbti += (details.friendliness_with_pets <= 3) ? 'T' : 'F';

  // J (판단) vs P (인식)
  mbti += (details.trainability >= 4) ? 'J' : 'P';

  return mbti;
}

// --- 메인 로직 ---
async function assignMbtiTypes() {
  console.log("Fetching all breeds with their details...");
  const { data: breeds, error } = await supabase
    .from('breeds')
    .select(`
      id,
      name_ko,
      breed_details (*)
    `);

  if (error) {
    console.error("Error fetching breeds:", error.message);
    return;
  }

  console.log(`Found ${breeds.length} breeds to process.`);

  for (const breed of breeds) {
    if (!breed.breed_details) {
      console.log(`  - Skipping ${breed.name_ko}: No details available.`);
      continue;
    }

    const inferredMbti = inferMbti(breed.breed_details);
    
    if (inferredMbti) {
      console.log(`  > Assigning ${inferredMbti} to ${breed.name_ko}...`);
      const { error: updateError } = await supabase
        .from('breeds')
        .update({ dog_mbti: inferredMbti })
        .eq('id', breed.id);

      if (updateError) {
        console.error(`  ❌ Failed to update ${breed.name_ko}: ${updateError.message}`);
      } else {
        console.log(`  ✅ Successfully assigned MBTI to ${breed.name_ko}`);
      }
    }
    // API 과부하 방지를 위한 짧은 딜레이
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log("\n--- All MBTI assignments processed. ---");
}

assignMbtiTypes();
