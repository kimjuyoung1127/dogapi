// scripts/get_breeds_to_update.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

// 💡 .env.local 파일에서 환경 변수를 제대로 가져오려면, 서비스 키를 직접 참조해야 할 수 있습니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Service Key is missing. Make sure .env.local is configured correctly.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getBreedsToUpdate() {
  // 1. 모든 견종 ID 가져오기
  const { data: allBreeds, error: allBreedsError } = await supabase
    .from('breeds')
    .select('id, name_en, name_ko');
  if (allBreedsError) {
    console.error('Error fetching all breeds:', allBreedsError.message);
    return;
  }

  // 2. 이미 details가 있는 견종 ID 가져오기
  const { data: existingDetails, error: existingDetailsError } = await supabase
    .from('breed_details')
    .select('breed_id');
  if (existingDetailsError) {
    console.error('Error fetching existing details:', existingDetailsError.message);
    return;
  }
  const existingBreedIds = new Set(existingDetails.map(d => d.breed_id));

  // 3. 두 목록을 비교하여 업데이트가 필요한 견종만 필터링
  const breedsToUpdate = allBreeds.filter(b => !existingBreedIds.has(b.id));
  
  console.log(JSON.stringify(breedsToUpdate, null, 2));
}

getBreedsToUpdate();
