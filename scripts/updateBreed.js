// scripts/updateBreed.js
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

const breedToUpdate = {
  name_en: "Irish Wolfhound",
  history: "5세기부터 기록된 아일랜드의 고대 품종으로, 늑대와 거대한 아일랜드 엘크를 사냥하는 데 사용되었습니다. 왕족과 귀족만이 소유할 수 있었던 이 개는, 늑대가 멸종하면서 19세기에는 거의 사라졌으나, 조지 그레이엄 대위의 헌신적인 노력으로 스코티시 디어하운드 등과의 교배를 통해 복원되었습니다.",
  summary: "온화한, 인내심 강한, 충성심 높은, 다정한, 위엄 있는"
};

async function updateBreed() {
  console.log(`- "${breedToUpdate.name_en}" 견종의 정보를 업데이트합니다...`);

  try {
    const { data, error } = await supabase
      .from('breeds')
      .update({ 
        history: breedToUpdate.history,
        summary: breedToUpdate.summary
      })
      .eq('name_en', breedToUpdate.name_en)
      .select();

    if (error) throw error;

    if (data && data.length > 0) {
      console.log(`--- ✅ "${breedToUpdate.name_en}" 정보가 성공적으로 업데이트되었습니다. ---`);
    } else {
      console.log(`--- ⚠️ 업데이트할 "${breedToUpdate.name_en}" 정보를 찾지 못했습니다. ---`);
    }

  } catch (err) {
    console.error("오류 발생:", err.message);
  }
}

updateBreed();
