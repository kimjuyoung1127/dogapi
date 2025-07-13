// scripts/seedMbtiData.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const mbtiDescriptions = [
  { mbti_type: 'ISTJ', title: '청렴결백한 논리주의자', description: '책임감이 강하고 듬직하며, 정해진 규칙을 잘 따르는 모범생 타입입니다. 조용하고 한결같은 성격으로 신뢰를 줍니다.' },
  { mbti_type: 'ISFJ', title: '용감한 수호자', description: '차분하고 헌신적이며, 가족을 보호하려는 성향이 강합니다. 주인의 감정을 잘 살피는 다정한 반려견입니다.' },
  { mbti_type: 'INFJ', title: '선의의 옹호자', description: '통찰력이 있고 조용하지만, 주인과 깊은 유대를 형성합니다. 혼자 있는 시간을 즐기지만, 선택된 소수와는 강한 애착을 보입니다.' },
  { mbti_type: 'INTJ', title: '용의주도한 전략가', description: '독립적이고 분석적이며, 문제를 해결하는 것을 즐깁니다. 때로는 고집이 세 보일 수 있지만, 매우 똑똑한 전략가입니다.' },
  { mbti_type: 'ISTP', title: '만능 재주꾼', description: '호기심이 많고 대담하며, 새로운 환경을 탐험하는 것을 좋아합니다. 혼자서도 잘 놀며, 에너지가 넘칩니다.' },
  { mbti_type: 'ISFP', title: '호기심 많은 예술가', description: '온화하고 느긋하며, 주변 환경의 아름다움을 즐길 줄 아는 매력적인 친구입니다. 갑작스러운 변화에는 스트레스를 받을 수 있습니다.' },
  { mbti_type: 'INFP', title: '열정적인 중재자', description: '조용하고 온화하지만, 주인에 대한 깊은 애정을 가지고 있습니다. 혼자만의 시간을 즐기면서도, 가족과의 유대를 중요하게 생각합니다.' },
  { mbti_type: 'INTP', title: '논리적인 사색가', description: '지적 호기심이 강하고, 혼자 생각에 잠기는 것을 좋아합니다. 때로는 무심해 보일 수 있지만, 흥미로운 것에는 깊이 파고듭니다.' },
  { mbti_type: 'ESTP', title: '모험을 즐기는 사업가', description: '에너지가 넘치고, 항상 움직이며 주변의 관심을 즐깁니다. 지루한 것을 싫어하며, 늘 새로운 자극을 찾아다닙니다.' },
  { mbti_type: 'ESFP', title: '자유로운 영혼의 연예인', description: '사교성이 뛰어나고, 어디서나 주목받는 것을 즐기는 분위기 메이커입니다. 즐거움을 추구하며, 긍정적인 에너지를 발산합니다.' },
  { mbti_type: 'ENFP', title: '재기발랄한 활동가', description: '사람들과 어울리는 것을 좋아하고, 새로운 것에 대한 호기심이 넘치는 인싸 댕댕이입니다. 긍정적인 에너지가 넘쳐 주변을 항상 즐겁게 만듭니다.' },
  { mbti_type: 'ENTP', title: '뜨거운 논쟁을 즐기는 변론가', description: '지능적이고 장난기가 많으며, 주인을 시험해보는 듯한 행동을 하기도 합니다. 똑똑한 만큼, 쉽게 지루함을 느낍니다.' },
  { mbti_type: 'ESTJ', title: '엄격한 관리자', description: '규칙과 질서를 중시하며, 자기가 맡은 바를 책임감 있게 해냅니다. 훈련을 잘 따르며, 집안의 든든한 지킴이 역할을 합니다.' },
  { mbti_type: 'ESFJ', title: '사교적인 외교관', description: '사람들의 기분을 맞추는 것을 좋아하고, 칭찬받는 것을 즐깁니다. 가족 구성원 모두에게 사랑을 나눠주는 사랑둥이입니다.' },
  { mbti_type: 'ENFJ', title: '정의로운 사회운동가', description: '다른 강아지나 사람들을 이끄는 것을 좋아하며, 무리의 안정을 중요하게 생각합니다. 카리스마와 매력이 넘칩니다.' },
  { mbti_type: 'ENTJ', title: '대담한 통솔자', description: '똑똑하고 자신감이 넘치며, 무리의 리더가 되려는 경향이 있습니다. 목표 지향적이라 ��련 성과가 매우 뛰어납니다.' },
];

const breedMbtiUpdates = [
  { name_en: 'Golden Retriever', dog_mbti: 'ENFP' },
  { name_en: 'Border Collie', dog_mbti: 'ENTJ' },
  { name_en: 'Shiba Inu', dog_mbti: 'INFP' },
  { name_en: 'German Shepherd Dog', dog_mbti: 'ISTJ' },
  { name_en: 'Poodle (Toy)', dog_mbti: 'ENFP' },
  { name_en: 'Beagle', dog_mbti: 'ESFP' },
];

async function seedMbtiData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🔄 Upserting 16 MBTI descriptions...');
  const { error: descError } = await supabase.from('mbti_descriptions').upsert(mbtiDescriptions);
  if (descError) console.error('Description upsert error:', descError.message);
  else console.log('✅ MBTI descriptions upserted!');

  console.log('🔄 Updating dog_mbti for representative breeds...');
  for (const breed of breedMbtiUpdates) {
    await supabase.from('breeds').update({ dog_mbti: breed.dog_mbti }).eq('name_en', breed.name_en);
  }
  console.log('✅ Representative breeds updated!');
}

seedMbtiData();