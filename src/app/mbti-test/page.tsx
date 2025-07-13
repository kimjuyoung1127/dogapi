// src/app/mbti-test/page.tsx
'use client';

import { useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type MbtiDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

const mbtiQuestions = [
  { question: "산책 중 다른 강아지를 만나면, 먼저 다가가서 냄새를 맡나요?", choiceA: { text: "네, 완전 인싸에요!", type: 'E' }, choiceB: { text: "아니요, 힐끔 보고 지나가요.", type: 'I' } },
  { question: "새로운 장난감보다, 늘 가지고 놀던 익숙한 장난감을 더 좋아하나요?", choiceA: { text: "네, 익숙한 게 최고죠.", type: 'S' }, choiceB: { text: "아니요, 새로운 건 못 참죠!", type: 'N' } },
  { question: "간식이 없을 때도, 주인의 칭찬만으로 만족감을 표현하나요?", choiceA: { text: "아니요, 현실적인 편이에요.", type: 'T' }, choiceB: { text: "네, 칭찬은 강아지도 춤추게 해요!", type: 'F' } },
  { question: "정해진 시간에 산책을 나가지 않으면, 보채거나 불안해하나요?", choiceA: { text: "네, 칼같이 지켜야 해요.", type: 'J' }, choiceB: { text: "아니요, 딱히 상관 안 해요.", type: 'P' } },
  { question: "낯선 사람이 집에 방문했을 때, 경계하기보다 반기는 편인가요?", choiceA: { text: "네, 사람을 너무 좋아해요.", type: 'E' }, choiceB: { text: "아니요, 일단 짖고 봐요.", type: 'I' } },
  { question: "장난감을 가지고 놀 때, 주로 물고 빠는 등 감각적으로 탐색하나요?", choiceA: { text: "네, 입으로 가져가는 게 국룰이죠.", type: 'S' }, choiceB: { text: "아니요, 던지고 굴리면서 다양하게 놀아요.", type: 'N' } },
  { question: "잘못했을 때 혼내면, 시무룩해지거나 눈치를 보나요?", choiceA: { text: "네, 감정이 얼굴에 다 드러나요.", type: 'F' }, choiceB: { text: "아니요, 금방 잊어버리는 것 같아요.", type: 'T' } },
  { question: "산책 코스가 항상 같아도, 즐거워하며 잘 다니나요?", choiceA: { text: "네, 안정적인 걸 좋아해요.", type: 'J' }, choiceB: { text: "아니요, 새로운 길로 가고 싶어 해요.", type: 'P' } },
];

// --- 💡 useReducer를 위한 상태 및 액션 타입 정의 ---
interface TestState {
  step: 'start' | 'testing' | 'result';
  answers: MbtiDimension[];
  currentQuestionIndex: number;
}

type TestAction = 
  | { type: 'START_TEST' }
  | { type: 'ANSWER', payload: MbtiDimension }
  | { type: 'RESET_TEST' };

const initialState: TestState = {
  step: 'start',
  answers: [],
  currentQuestionIndex: 0,
};

function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'START_TEST':
      return { ...initialState, step: 'testing' };
    case 'ANSWER':
      const newAnswers = [...state.answers, action.payload];
      const isLastQuestion = state.currentQuestionIndex === mbtiQuestions.length - 1;
      return {
        ...state,
        answers: newAnswers,
        currentQuestionIndex: isLastQuestion ? state.currentQuestionIndex : state.currentQuestionIndex + 1,
        step: isLastQuestion ? 'result' : 'testing',
      };
    case 'RESET_TEST':
      return initialState;
    default:
      return state;
  }
}

const calculateResult = (userAnswers: MbtiDimension[]): string => {
  const counts = userAnswers.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<MbtiDimension, number>);

  let result = '';
  result += (counts['E'] || 0) >= (counts['I'] || 0) ? 'E' : 'I';
  result += (counts['S'] || 0) >= (counts['N'] || 0) ? 'S' : 'N';
  result += (counts['T'] || 0) >= (counts['F'] || 0) ? 'F' : 'T';
  result += (counts['J'] || 0) >= (counts['P'] || 0) ? 'P' : 'J';
  return result;
};

export default function MbtiTestPage() {
  const [state, dispatch] = useReducer(testReducer, initialState);

  const renderContent = () => {
    switch (state.step) {
      case 'testing':
        const question = mbtiQuestions[state.currentQuestionIndex];
        const progress = ((state.currentQuestionIndex + 1) / mbtiQuestions.length) * 100;
        return (
          <Card>
            <CardHeader>
              <Progress value={progress} className="mb-4" />
              <CardTitle>Q{state.currentQuestionIndex + 1}.</CardTitle>
              <CardDescription className="text-lg">{question.question}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <Button size="lg" onClick={() => dispatch({ type: 'ANSWER', payload: question.choiceA.type })}>{question.choiceA.text}</Button>
              <Button size="lg" onClick={() => dispatch({ type: 'ANSWER', payload: question.choiceB.type })} variant="outline">{question.choiceB.text}</Button>
            </CardContent>
          </Card>
        );
      case 'result':
        const finalResult = calculateResult(state.answers);
        return (
          <Card className="text-center">
            <CardHeader>
              <CardDescription>내 강아지의 성향은?</CardDescription>
              <CardTitle className="text-4xl font-bold text-primary">{finalResult}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6">
                {/* TODO: DB에서 MBTI 유형에 맞는 설명과 대표 견종 가져오기 */}
                {finalResult} 유형에 대한 설명이 여기에 표시됩니다.
              </p>
              <Button size="lg" onClick={() => dispatch({ type: 'RESET_TEST' })}>
                다시 테스트하기
              </Button>
            </CardContent>
          </Card>
        );
      case 'start':
      default:
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">내 강아지 성향 테스트</h1>
            <p className="text-muted-foreground mb-8">간단한 질문으로 내 강아지의 MBTI를 알아보세요!</p>
            <Button size="lg" onClick={() => dispatch({ type: 'START_TEST' })}>
              테스트 시작하기
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12">
      {renderContent()}
    </div>
  );
}