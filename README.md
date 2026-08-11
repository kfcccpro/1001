# Chunilmun PFAL T1

천일문 완성 트레이닝북을 기반으로 한 1인 학습자 / 1인 관리자용 PFAL 영어 구조독해 웹앱입니다.

## 운영 원칙

**GitHub 원격 `main` 브랜치가 유일한 기준본입니다.**

- 학생 PIN: `8081`
- 관리자 PIN: `2007`
- HTML / CSS / Vanilla JS
- 별도 빌드 없음
- PWA 기초 구조
- GitHub Pages 자동 배포

## 수정 흐름

`요청 → GitHub main 최신본 확인 → 최소 수정 → 검증 → commit → main 반영 → 자동배포 → 실제 URL 테스트`

사용자는 일반적으로 파일을 직접 옮기거나 덮어쓸 필요가 없습니다.

## GitHub Pages 최초 1회 설정

Repository Settings → Pages에서 Source를 **GitHub Actions**로 선택합니다. 이후 `main` 변경 시 자동 배포됩니다.

## 주요 문서

- `PROJECT_STATUS.md`: 현재 기준 상태
- `docs/GITHUB_OPERATING_MODEL.md`: 유지보수 운영 원칙
- `CHANGELOG.md`: 버전별 변경 내용
