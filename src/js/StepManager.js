/**
 * StepManager.js
 * 13단계 메타데이터 관리
 */

// 13 단계 상수를 직접 정의 (또는 constants.js에서 import 가능)
const STEPS = [
  {
    id: 1,
    title: "LLM 파이프라인: 정확한 AI의 비결",
    section: "intro",
    duration: 30,
    content: { heading: "LLM 파이프라인: 정확한 AI의 비결", description: "음식점 비유로 배우는 환각 방지 기술", analogy: "음식점이 정확한 주문을 배달하는 방식과 AI 파이프라인의 원리를 배웁니다", keyPoint: "AI도 음식점처럼 단계별 검증을 거쳐야 거짓을 말하지 않습니다" },
    visualization: { type: "title", nodes: [], edges: [] }
  },
  {
    id: 2,
    title: "일반 AI의 문제: 환각(Hallucination)",
    section: "intro",
    duration: 60,
    content: { heading: "일반 AI는 거짓을 마치 사실인 것처럼 말합니다", description: "일반 AI는 데이터가 없어도 그럴듯한 거짓을 생성합니다", analogy: "거짓말하는 웨이터가 주문을 받고 아무 확인 없이 대충 넘기는 것처럼", keyPoint: "AI가 거짓을 말하는 이유는 데이터 검증 없이 순진하게 텍스트만 생성하기 때문입니다" },
    visualization: { type: "hallucination", nodes: [{ id: "question", type: "input", x: 100, y: 300, label: "사용자 질문" }, { id: "llm", type: "process", x: 300, y: 300, label: "LLM" }, { id: "false_answer", type: "error", x: 500, y: 300, label: "거짓 답변" }], edges: [{ id: "e1", from: "question", to: "llm" }, { id: "e2", from: "llm", to: "false_answer" }] }
  },
  {
    id: 3,
    title: "skeleton-analysis: 10계층 검증 시스템",
    section: "intro",
    duration: 60,
    content: { heading: "음식점처럼 단계별 검증으로 거짓을 막습니다", description: "음식점은 주문, 주방, 검사, 배달 의 각 단계에서 확인합니다", analogy: "웨이터, 주방장, 위생 검사관, 배달원이 각자 확인하는 음식점 프로세스", keyPoint: "10계층 검증: 우회, 제약, 합의, 강제필터, 재필터, LLM팩트체크, 코드팩트체크, 템플릿폴백, 래핑검증, 강제템플릿" },
    visualization: { type: "overview", nodes: [{ id: "start", type: "input", x: 100, y: 300, label: "질문" }, { id: "phase0", type: "process", x: 250, y: 150, label: "Phase 0" }, { id: "phase1", type: "process", x: 250, y: 300, label: "Phase 1" }, { id: "verify", type: "validate", x: 450, y: 300, label: "검증" }, { id: "end", type: "output", x: 600, y: 300, label: "답변" }], edges: [{ id: "e1", from: "start", to: "phase0" }, { id: "e2", from: "start", to: "phase1" }, { id: "e4", from: "phase0", to: "verify" }, { id: "e5", from: "phase1", to: "verify" }, { id: "e7", from: "verify", to: "end" }] }
  },
  { id: 4, title: "Phase 0: 빠른 경로 (우회)", section: "basic", duration: 90, content: { heading: "첫 번째 검증", description: "간단한 질문이면 LLM 호출 0회", analogy: "자주 주문하는 음식은 메뉴판에 있으므로 즉시 제공", keyPoint: "키워드 매칭이나 인사이트 함수로 LLM 호출을 완전히 회피합니다" }, visualization: { type: "fast_path", nodes: [{ id: "question", type: "input", x: 100, y: 300, label: "질문" }, { id: "keyword", type: "validate", x: 300, y: 300, label: "키워드" }, { id: "answer", type: "output", x: 700, y: 300, label: "답변" }], edges: [{ id: "e1", from: "question", to: "keyword" }, { id: "e3", from: "keyword", to: "answer" }] } },
  { id: 5, title: "Phase 1: 3개 SQL 생성과 투표", section: "basic", duration: 120, content: { heading: "두 번째 검증", description: "3개 LLM이 각자 SQL을 만들고 투표합니다", analogy: "여러 주방장의 다양한 의견을 수집하여 최선의 방법을 선택", keyPoint: "다수결 투표로 가장 합의가 많은 SQL을 선택합니다" }, visualization: { type: "voting", nodes: [], edges: [] } },
  { id: 6, title: "Phase 1: 안전 필터 강제 주입", section: "basic", duration: 90, content: { heading: "세 번째 검증", description: "LLM이 생성한 SQL에 안전 필터를 강제로 추가합니다", analogy: "위생 검사관이 위험한 재료 사용을 감시하고 강제로 제거", keyPoint: "LLM을 신뢰하지 않고 코드 레벨에서 필터를 강제 적용합니다" }, visualization: { type: "filter_gate", nodes: [], edges: [] } },
  { id: 7, title: "Phase 2: DB 실행 및 클라이언트 필터", section: "process", duration: 90, content: { heading: "네 번째 검증", description: "SQL 실행 후에도 결과를 다시 필터링합니다", analogy: "배달 온 음식을 받은 후 한 번 더 확인하는 단계", keyPoint: "DB 결과도 믿지 않고 클라이언트에서 다시 한 번 검증합니다" }, visualization: { type: "db_execution", nodes: [], edges: [] } },
  { id: 8, title: "Phase 3: 데이터 기반 답변 생성", section: "process", duration: 90, content: { heading: "다섯 번째 검증", description: "정제된 데이터를 바탕으로 LLM이 답변을 생성합니다", analogy: "주방장이 제한된 재료로만 요리합니다", keyPoint: "DB 결과를 입력으로 주므로, LLM은 거기에만 집중하면 됩니다" }, visualization: { type: "answer_generation", nodes: [], edges: [] } },
  { id: 9, title: "Phase 4: 이중 팩트체크", section: "process", duration: 120, content: { heading: "여섯 번째/일곱 번째 검증", description: "LLM이 생성한 답변의 모든 숫자가 DB 데이터에 존재하는지 확인합니다", analogy: "배달된 음식이 주문과 정확히 일치하는지 확인", keyPoint: "답변의 소수점 숫자 하나하나가 DB에서 나온 데이터인지 검증합니다" }, visualization: { type: "factcheck", nodes: [], edges: [] } },
  { id: 10, title: "Phase 5: 템플릿 폴백", section: "validate", duration: 90, content: { heading: "여덟 번째 검증", description: "점수 0.8 미만이면 템플릿 사용", analogy: "음식이 이상하면 기본 메뉴 제공", keyPoint: "의심스러운 답변은 즉시 버리고 안전한 템플릿으로 전환합니다" }, visualization: { type: "template_fallback", nodes: [], edges: [] } },
  { id: 11, title: "Phase 5: 자연어 래핑 및 검증", section: "validate", duration: 90, content: { heading: "아홉 번째/열 번째 검증", description: "자연어 재작성 + 수치 보존 검증", analogy: "음식을 예쁜 플레이팅으로 최종 제시", keyPoint: "래핑 후에도 숫자를 다시 검증해서 누락되지 않았는지 확인합니다" }, visualization: { type: "wrapping", nodes: [], edges: [] } },
  { id: 12, title: "실제 사례 1: 빠른 경로", section: "case", duration: 120, content: { heading: "여찬혁의 기록이 뭐야", description: "단순 선수 이름 질문 처리", analogy: "자주 주문하는 고객은 빠르게 처리", keyPoint: "아무도 LLM을 부르지 않았습니다" }, visualization: { type: "case_fast", nodes: [], edges: [] } },
  { id: 13, title: "실제 사례 2: 풀 파이프라인", section: "case", duration: 150, content: { heading: "12월 평균 기록은", description: "Phase 0 실패 후 전체 파이프라인 통과", analogy: "특별한 주문 처리", keyPoint: "모든 검증을 거쳐야 신뢰할 수 있는 답변이 됩니다" }, visualization: { type: "case_full", nodes: [], edges: [] } },
];

export class StepManager {
  getStepData(stepNum) {
    if (stepNum < 1 || stepNum > STEPS.length) return null;
    return STEPS[stepNum - 1];
  }

  getTotalSteps() {
    return STEPS.length;
  }

  getStepProgress(stepNum) {
    return Math.round((stepNum / STEPS.length) * 100);
  }

  getNextStep(stepNum) {
    return Math.min(stepNum + 1, STEPS.length);
  }

  getPrevStep(stepNum) {
    return Math.max(stepNum - 1, 1);
  }

  isFirstStep(stepNum) {
    return stepNum === 1;
  }

  isLastStep(stepNum) {
    return stepNum === STEPS.length;
  }

  getAllSteps() {
    return STEPS;
  }
}

export default StepManager;
