// scripts/findMissingDetails.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL 또는 Service Role Key가 .env.local 파일에 없습니다.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findMissingDetails() {
  console.log("1. 정보가 부실한 견종 상세 정보를 조회합니다 (기준: 특징 점수 중 하나라도 3인 경우)...");

  try {
    const { data: details, error: detailsError } = await supabase
      .from('breed_details')
      .select('breed_id, adaptability, friendliness_with_kids, energy_level')
      .or('adaptability.eq.3,friendliness_with_kids.eq.3,energy_level.eq.3');

    if (detailsError) throw detailsError;

    if (!details || details.length === 0) {
      console.log("모든 견종의 특징 점수가 잘 채워져 있습니다. 추가 보강이 필요 없습니다.");
      return;
    }
    
    console.log(`\n--- 
 총 ${details.length}개의 견종에 대한 보강이 필요합니다 ---`);

    const breedIds = details.map(d => d.breed_id);
    const { data: breeds, error: breedsError } = await supabase
      .from('breeds')
      .select('id, name_ko, name_en')
      .in('id', breedIds);

    if (breedsError) throw breedsError;
    if (!breeds) {
        console.error("견종 이름 정보를 가져오는 데 실패했습니다.");
        return;
    }

    const formattedData = details.map(detail => {
      const breedInfo = breeds.find(b => b.id === detail.breed_id);
      return {
        id: detail.breed_id,
        name_ko: breedInfo?.name_ko,
        name_en: breedInfo?.name_en,
      };
    });

    console.table(formattedData);
    console.log("\n2. 다음 단계에서 위 목록의 견종 정보를 웹에서 검색하여 보강하겠습니다.");

  } catch (err) {
    console.error("오류 발생:", err.message);
  }
}

findMissingDetails();
