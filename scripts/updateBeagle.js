// scripts/updateBeagle.js
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

const beagleData = {
  history: "19세기 영국에서 토끼 사냥을 위해 개발되었으며, 그 기원은 고대 그리스까지 거슬러 올라갑니다. 뛰어난 후각 능력으로 유명하며, 1885년 AKC에 공식적으로 인정받았습니다.",
  summary: "쾌활한, 호기심 많은, 친근한, 영리한, 추적 본능"
};

async function updateBeagle() {
  console.log("1. '비글' 견종의 정보를 업데이트합니다...");

  try {
    const { data, error } = await supabase
      .from('breeds')
      .update({ 
        history: beagleData.history,
        summary: beagleData.summary
      })
      .eq('name_en', 'Beagle')
      .select();

    if (error) throw error;

    if (data && data.length > 0) {
      console.log("\n--- ✅ '비글' 정보가 성공적으로 업데이트되었습니다. ---");
      console.log("업데이트된 내용:", data[0]);
    } else {
      console.log("업데이트할 '비글' 정보를 찾지 못했습니다.");
    }

  } catch (err) {
    console.error("오류 발생:", err.message);
  }
}

updateBeagle();
