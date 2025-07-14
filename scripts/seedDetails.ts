// scripts/seedDetails.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';
import type { Database } from '../src/lib/supabase/database.types';

// .env.local 파일에서 환경 변수를 로드합니다.
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dogApiKey = process.env.DOG_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !dogApiKey) {
  throw new Error("필수 환경 변수가 .env.local 파일에 없습니다.");
}

// 💡 여기서 배운 점: 생성된 DB 타입을 제네릭으로 전달하면, 클라이언트는 스키마를 완벽하게 인지한다.
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// API 응답을 위한 타입 정의
interface DogApiBreed {
  id: number;
  name: string;
  description?: string;
  temperament?: string;
  history?: string;
  height?: { metric: string };
}

// 딜레이 함수
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mapTemperamentToRating = (temperament: string | undefined): number => {
  if (!temperament) return 3;
  const lower = temperament.toLowerCase();
  if (lower.includes('aggressive') || lower.includes('stubborn')) return 1;
  if (lower.includes('aloof') || lower.includes('independent')) return 2;
  if (lower.includes('playful') || lower.includes('curious')) return 4;
  if (lower.includes('friendly') || lower.includes('loyal') || lower.includes('affectionate')) return 5;
  return 3;
};

async function seedBreedDetails() {
  try {
    console.log("1. `breeds` 테이블에서 모든 견종 목록을 가져옵니다...");
    const { data: breeds, error: breedsError } = await supabase
      .from('breeds')
      .select('id, name_en');

    if (breedsError) throw breedsError;
    if (!breeds) {
      console.log("데이터베이스에서 견종을 찾을 수 없습니다.");
      return;
    }
    console.log(`   => 총 ${breeds.length}종의 견종을 찾았습니다.`);

    console.log("\n2. 각 견종에 대해 The Dog API에서 상세 정보를 가져와 DB에 저장합니다...");
    for (const [index, breed] of breeds.entries()) {
      // 🐞 버그 수정: API 요청 제한을 피하기 위해 각 요청 사이에 딜레이를 추가합니다.
      await sleep(200); 
      
      console.log(`   - 처리 중 (${index + 1}/${breeds.length}): ${breed.name_en}`);
      
      try {
        const response = await axios.get<DogApiBreed[]>(`https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(breed.name_en)}`, {
          headers: { 'x-api-key': dogApiKey }
        });

        const apiBreedData = response.data[0];

        if (apiBreedData) {
          // 🐞 버그 수정: API 응답 데이터가 불완전할 경우를 대비한 방어 코드 추가
          const temperament = apiBreedData.temperament;
          const height = apiBreedData.height?.metric;

          const detailData = {
            breed_id: breed.id,
            description: apiBreedData.description || `A brief overview of the ${apiBreedData.name}.`,
            history: apiBreedData.history || 'No history available.',
            size: height ? (height.includes(' - ') ? '중형' : '소형') : '정보 없음',
            adaptability: mapTemperamentToRating(temperament),
            friendliness: mapTemperamentToRating(temperament),
            health_needs: 3,
            trainability: mapTemperamentToRating(temperament),
            exercise_needs: temperament ? mapTemperamentToRating(temperament.includes('Active') ? 'Active' : '') : 3,
            shedding_level: 3,
          };

          const { error: upsertError } = await supabase
            .from('breed_details')
            .upsert(detailData, { onConflict: 'breed_id' });

          if (upsertError) {
            console.error(`     [오류] ${breed.name_en} 정보 저장 실패:`, upsertError.message);
          } else {
            console.log(`     [성공] ${breed.name_en}의 상세 정보가 저장되었습니다.`);
          }
        } else {
          console.warn(`     [경고] The Dog API에서 ${breed.name_en} 정보를 찾을 수 없습니다.`);
        }
      } catch (apiError: any) {
        const errorMessage = apiError.response ? `(Status ${apiError.response.status}) ${apiError.response.data?.message}` : apiError.message;
        console.error(`     [API 오류] ${breed.name_en} 처리 중 오류 발생:`, errorMessage);
      }
    }
    console.log("\n3. 모든 견종의 상세 정보 시딩 작업이 완료되었습니다.");

  } catch (error: any) {
    console.error("스크립트 실행 중 심각한 오류 발생:", error.message);
  }
}

seedBreedDetails();
