// scripts/enrichAllBreeds.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
// 'google-search-results-nodejs'와 같은 라이브러리가 필요하지만,
// 여기서는 개념 설명을 위해 가상의 search 함수를 사용합니다.
// 실제 구현에서는 google_web_search 도구를 활용해야 합니다.

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL 또는 Service Role Key가 .env.local 파일에 없습니다.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 가상의 웹 검색 함수 (실제로는 google_web_search 도구 사용)
async function webSearch(query) {
  console.log(`   - 웹 검색 중: "${query}"`);
  // 실제 구현에서는 이 부분에 google_web_search 호출 로직이 들어갑니다.
  // 여기서는 예시 결과를 반환합니다.
  if (query.includes('history')) {
    return "The breed was developed in the 19th century in Germany for hunting badgers.";
  }
  if (query.includes('temperament')) {
    return "Known for being playful, courageous, and stubborn.";
  }
  return "";
}

// 딜레이 함수
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function enrichAllBreeds() {
  console.log("1. 정보가 부실한 견종 목록을 조회합니다...");
  const { data: breedsToEnrich, error: fetchError } = await supabase
    .from('breeds')
    .select('id, name_en')
    .or('history.eq.N/A,history.is.null,summary.is.null');

  if (fetchError) throw fetchError;
  if (!breedsToEnrich || breedsToEnrich.length === 0) {
    console.log("모든 견종 정보가 이미 충분합니다.");
    return;
  }

  console.log(`\n--- 총 ${breedsToEnrich.length}개의 견종에 대한 보강을 시작합니다 ---\n`);

  for (const [index, breed] of breedsToEnrich.entries()) {
    console.log(`[${index + 1}/${breedsToEnrich.length}] "${breed.name_en}" 정보 보강 중...`);
    
    try {
      // History 정보 검색 및 요약 (실제로는 더 정교한 요약 로직 필요)
      const historyText = await webSearch(`${breed.name_en} dog history`);
      
      // Summary 정보 검색 및 키워드 추출 (실제로는 더 정교한 추출 로직 필요)
      const temperamentText = await webSearch(`${breed.name_en} dog temperament`);
      const summaryKeywords = temperamentText.match(/\b\w+\b/g)?.slice(0, 5).join(', ') || "정보 없음";

      const updateData = {
        history: historyText || "N/A",
        summary: summaryKeywords
      };

      const { error: updateError } = await supabase
        .from('breeds')
        .update(updateData)
        .eq('id', breed.id);

      if (updateError) {
        console.error(`   - [오류] "${breed.name_en}" 업데이트 실패:`, updateError.message);
      } else {
        console.log(`   - [성공] "${breed.name_en}" 업데이트 완료.`);
      }

    } catch (e) {
      console.error(`   - [치명적 오류] "${breed.name_en}" 처리 중 문제 발생:`, e.message);
    }
    
    await sleep(500); // API 과부하 방지를 위한 딜레이
  }

  console.log("\n--- ✅ 모든 견종 정보 보강 작업이 완료되었습니다. ---");
}

enrichAllBreeds();