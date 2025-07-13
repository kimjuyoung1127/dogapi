-- ✅ 기능 목적 요약: `breed_details` 테이블에 `breeds` 테이블을 참조하는 외래 키 제약 조건을 추가합니다.
-- 💡 여기서 배운 점: 테이블 간의 관계를 명시적으로 설정해야 Supabase의 조인 기능을 올바르게 사용할 수 있다.

ALTER TABLE public.breed_details
ADD CONSTRAINT fk_breed_details_breed_id
FOREIGN KEY (breed_id)
REFERENCES public.breeds(id);
