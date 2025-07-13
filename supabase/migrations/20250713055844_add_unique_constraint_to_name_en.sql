-- ✅ 기능 목적 요약: `breeds` 테이블의 `name_en` 열에 UNIQUE 제약 조건을 추가합니다.
-- 💡 여기서 배운 점: `upsert`와 `onConflict`를 사용하려면, 기준이 되는 열에 반드시 UNIQUE 또는 PRIMARY KEY 제약 조건이 있어야 한다.
ALTER TABLE public.breeds
ADD CONSTRAINT breeds_name_en_key UNIQUE (name_en);
