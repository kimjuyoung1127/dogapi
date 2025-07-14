// scripts/findMissingBreeds.js
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

async function findMissingBreeds() {
  console.log("1. `breeds` 테이블에서 정보가 부실한 견종 목록을 조회합니다...");

  try {
    const { data, error } = await supabase
      .from('breeds')
      .select('id, name_en, name_ko, history, summary')
      .or('history.eq.N/A,history.is.null,summary.is.null');

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log("모든 견종의 history와 summary 정보가 잘 채워져 있습니다.");
      return;
    }
    
    console.log(`\n--- 
 총 ${data.length}개의 견종에 대한 보강이 필요합니다 ---`);
    console.table(data.map(b => ({ id: b.id, name_en: b.name_en, name_ko: b.name_ko })));
    console.log("\n2. 다음 단계에서 위 목록의 견종 정보를 웹에서 검색하여 보강하겠습니다.");

  } catch (err) {
    console.error("오류 발생:", err.message);
  }
}

findMissingBreeds();
