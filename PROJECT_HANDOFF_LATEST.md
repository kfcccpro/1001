# 천일문 PFAL — PROJECT HANDOFF LATEST

> 이 문서는 새 ChatGPT 대화창에서 프로젝트를 즉시 이어가기 위한 **최신 작업 인계 기준본**이다.
> 새 대화에서는 먼저 이 파일과 `PROJECT_STATUS.md`, 최신 `main`을 읽은 뒤 작업한다.

## 1. 프로젝트 식별
- GitHub repository: `kfcccpro/1001`
- Canonical branch: `main`
- Live URL: `https://kfcccpro.github.io/1001/`
- Architecture: static HTML/CSS/Vanilla JS + JSON + Firebase Anonymous Auth + Firestore
- Build step: 없음
- Student: 1명
- Admin/Supervisor: 1명
- Student PIN: `8081`
- Admin/Supervisor PIN: `2007`
- PIN은 보안 인증이 아니라 화면 분기용이다.

## 2. 최상위 운영 원칙
1. GitHub remote `main`이 유일한 기준본이다.
2. 수정 전에 항상 최신 `main` 파일을 읽는다.
3. 작은 안전 수정은 직접 `main`에 커밋한다.
4. GitHub Pages는 Actions로 자동 배포한다.
5. 사용자 검수는 기본적으로 PIN 2007 **감독형 전체보기**를 사용한다.
6. 감독형에서는 문제를 풀지 않아도 이전/다음/점프가 가능하며 진도·학습시간을 저장하지 않는다.
7. 실제 학생 기록은 PIN 8081 학습 모드에서만 저장한다.
8. 학생 UI는 `One Screen · One Task · One Decision`을 유지한다.
9. 영어 원문은 크고 선명하게, 한글 안내·해설·버튼도 충분히 크게 표시한다.
10. 세로 스크롤을 최소화하고 가로 공간을 적극 사용한다. 데스크톱에서는 제출 후 피드백을 문제 옆에 배치하는 것을 기본으로 한다.
11. 문제집/해설집 출판사 원문과 PFAL 파생 콘텐츠는 데이터상 분리한다.
12. 공개 GitHub repo에 저작권 교재 전체를 무분별하게 복제하지 않는다.

## 3. 학습자 특성 / 교수설계
대상 학습자는 장기간 학원 경험이 있으나 시각적·인식형 학습 비중이 높고, 기초 문법 인출과 문장 구조분석이 약하다. 긴 문장에서 S/V, 절·수식어 경계, 병렬, 지시 관계를 명시적으로 잡는 데 어려움이 있다. ADHD 특성을 고려해 큰 카운트다운, 과도한 실패 강조, 복잡한 다단계 UX를 피한다.

핵심 철학:
- Recognition ≠ Mastery
- 문장/문제 → Cold Attempt → 구조 판단 → 오류 교정 → 전이 → 지연회상
- D+1 / D+3 / D+7 복습
- 꾸준함과 기억 인출을 시간·문제량보다 우선
- 오답 시 긴 설명을 바로 주지 않고 최소한의 사고 단계를 먼저 제공

## 4. 현재 콘텐츠 범위
- 천일문 완성 문제집 Chapter 1, Unit 01 `주어의 형태`
- source-aligned Q01~Q07 기반 약 17개 검증 문항
- 데이터: `data/unit01.json`
- 인터랙션: choice / text / span / pairSpan

주요 구조:
- Q01 현재분사 수식범위 + was/were
- Q02 동명사구 주어 + it 지시대상
- Q03 명사구/to부정사구 주어 + them 지시대상
- Q04 that절 주어 + to부정사 수식 + 관계사절
- Q05 what절 주어 + the former + as 의미
- Q06 의문사절 주어 + credible 입력
- Q07 topic + 병렬 술어 + for which 관계사절

## 5. 감독형 버전 — 개발 검수의 기본
PIN `2007`에서 감독형 전체보기를 사용한다.
- 답안 제출 불필요
- 이전 / 다음
- 문항 점프
- 정답·해설 선택적 확인
- 학습 진도 저장 없음
- 학습시간 기록 없음
- 복습 스케줄 생성 없음

사용자의 최근 명시적 요구: 개발 중에는 항상 이 감독형으로 전체를 빠르게 넘겨 보며 검수한다.

## 6. 실제 학생 학습 모드
PIN `8081`.
- 현재 진도 이어가기
- D+1/D+3/D+7 due review 우선
- 블록형 페이싱, 큰 카운트다운 없음
- 제출 후 정답/오답 피드백
- 실제 학습시간 기록
- 완료/오답/복습 진도 저장
- 여러 기기에서 동일 상태 이어가기 목표

### Guided Repair v0.9.2
사용자가 매우 만족한 방향으로 확정:
- 첫 오답에서 **정답을 바로 공개하지 않는다.**
- 한 단계 더 사고하게 한다.
- UI:
  - `한 번 더 생각`
  - `생각 힌트` — 문장 어디를 다시 볼지 쉬운 말 1문장
  - `개념 한 줄 · 용어` — 문법 용어를 쉬운 말 1줄로 정의
  - `다시 풀어보기`
  - `정답·해설 보기`
- 두 번째 실패 또는 사용자가 정답 보기를 선택하면 기존 상세 해설을 공개한다.
- PFAL 파생 힌트는 `repair-guides-v092.js`로 출판사 데이터와 분리한다.
- 로직은 `guided-repair-v092.js`.

예시 Q01:
- 생각 힌트: `Chinese people 뒤에서 ‘어떤 사람들?’이라고 물어보세요. 그 답이 되는 -ing 덩어리를 찾아봅니다.`
- 개념 한 줄 · 현재분사구: `명사 뒤에서 ‘어떤 ~인지’를 설명하는 -ing 중심의 덩어리입니다.`

## 7. UI 기준 — 최근 사용자 승인사항
사용자는 현재 전체 디자인과 큰 영문, 큰 한글 안내/해설에 만족했다.
다만 세로 스크롤 최소화를 요구했다.

### v0.9.3 Compact Layout 방향
- 영어 문장 크기는 크게 유지
- 상하 여백과 불필요한 margin 축소
- 데스크톱 980px 이상에서 제출 후:
  - 왼쪽: 문장/문제/선택
  - 오른쪽: 정답·해설 또는 Guided Repair
- 결과가 아래로 길게 밀려 내려가지 않도록 가로 공간 적극 활용
- 작은 화면은 단일 컬럼 유지하되 여백 압축
- 관련 파일: `compact-v093.css`

## 8. 클라우드 / 진도 / 실제 학습시간
사용자의 최우선 관리 요구:
- PC / 모바일 / Android 태블릿 / iPad 어느 기기에서도 동일 진도 이어가기
- 관리자가 통합 기록 확인
- **학습한 실제 시간이 가장 중요한 지표**

Backend:
- Firebase project: `moonma-f6dbe`
- background Anonymous Auth
- Firestore namespaces:
  - `chunilmun1001`
  - `chunilmun1001_sessions`
- Moonmago `shared/moonmago18day`와 논리적으로 분리

학습시간 원칙:
- 단순 접속시간과 실제 active time 분리
- 화면 visible + 최근 상호작용이 있을 때만 active time 누적
- 장시간 무동작/백그라운드 제외
- 세션별 active time / wall time / device / answers 저장
- 관리자 첫 숫자는 정확도가 아니라 `오늘 실제 학습시간`

관련 파일:
- `cloud-v09.js`
- `cloud-v09.css`
- `cloud-diagnostic-v091.js`
- `cloud-diagnostic-v091.css`

## 9. Firestore 규칙 현재 상태
사용자가 Firebase Console에서 다음 규칙을 직접 게시 완료했다고 보고했다.

허용 경로:
- `/shared/moonmago18day`
- `/chunilmun1001/{document=**}`
- `/chunilmun1001_sessions/{sessionId}`

모두 `request.auth != null` + anonymous sign-in provider 조건.
나머지는 deny.

GitHub의 기준 규칙 파일은 `kfcccpro/moonma/firestore.rules`에 있음.

### 아직 해야 하는 실검증
- PIN 2007 → `클라우드 연결 진단`
- Firebase SDK / anonymous auth / state read-write / session read-write 모두 PASS 확인
- 아직 PASS 스크린샷은 받지 못한 상태에서 다음 UI 작업으로 넘어왔다.

## 10. 관리자 화면
PIN `2007`.
주요 기능:
- 감독형 전체보기
- 문제 검증 모드
- 학습 모드 미리보기
- 클라우드 연결 진단
- 학습시간·진도 기록

관리자 기록 우선순위:
1. 오늘 실제 학습시간
2. 최근 7일 / 30일 누적 학습시간
3. Unit 진도
4. 현재 active session
5. 최근 접속 기기
6. 세션별 문제수/정답/시간

## 11. 성장/보상 설계
점수·코인보다 실제 능력 변화를 보여준다.
- 구조 찾기
- 직접 해결
- 어법·의미 적용
- 복습 기억
- 가장 긴 무도움 성공문장
- 충분한 근거가 있을 때만 Before → After 상승 표시
- 근거 부족 시 억지 점수 금지

## 12. 주요 파일
- `index.html`
- `app.js`
- `styles.css`
- `learning.css`
- `growth-v06.js/css`
- `compare-v07.js/css`
- `pacing-v08.js/css`
- `readability-v081.css`
- `supervisor-v082.js/css`
- `cloud-v09.js/css`
- `cloud-diagnostic-v091.js/css`
- `repair-guides-v092.js`
- `guided-repair-v092.js/css`
- `compact-v093.css`
- `data/unit01.json`
- `sw.js`
- `VERSION`
- `PROJECT_STATUS.md`

## 13. 다음 작업 우선순위
1. v0.9.3 compact layout 배포/QA 완료 및 실제 화면 확인
2. 데스크톱에서 결과/Guided Repair가 우측 패널로 들어가 스크롤이 줄었는지 확인
3. 태블릿/모바일에서 세로 여백 과다 여부 확인
4. PIN 2007 `클라우드 연결 진단` 실제 PASS 확인
5. PC → 모바일/태블릿 → PC 왕복 진도 동기화 실검증
6. active time이 visible/active에서만 증가하고 idle/background에서 멈추는지 실검증
7. 관리자 학습시간·진도 화면 실데이터 QA
8. Unit 01 UI/데이터 규격 동결
9. 이후 Chapter/Unit 확장

## 14. 새 채팅에서의 시작 명령
사용자가 새 채팅에서 아래 한마디만 입력하면 된다.

`천일문 다음 작업 진행`

새 채팅의 assistant는 즉시:
1. GitHub `kfcccpro/1001` 최신 `main` 확인
2. `PROJECT_HANDOFF_LATEST.md` 읽기
3. `PROJECT_STATUS.md` 읽기
4. `VERSION` 확인
5. 최신 Actions QA/Pages 배포 상태 확인
6. 위 `다음 작업 우선순위`의 첫 미완료 단계부터 질문 없이 진행

## 15. 사용자 작업 방식
사용자는 복잡한 Git/GitHub 조작보다:
- 요구사항 전달
- 실제 사이트 테스트
- 스크린샷/짧은 피드백
에 집중한다.

Assistant는 가능하면:
- 최신 main 읽기
- 최소 수정
- QA
- commit main
- 자동 배포 확인
- 결과 보고
를 직접 수행한다.

문제가 있으면 사용자는 `스크린샷 + 이 부분 수정` 정도만 보내면 된다.
