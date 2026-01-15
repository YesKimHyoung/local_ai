# Claude 프로젝트 가이드

이 파일은 Claude Code가 프로젝트 작업 시 참고하는 정보입니다.

## Git 저장소 정보

| 항목 | 값 |
|------|-----|
| Repository | https://github.com/YesKimHyoung/local_ai |
| Branch | main |
| Remote | origin |

## Git 커밋/푸시 방법

사용자가 "commit해줘", "git에 올려줘", "push해줘" 등 요청 시:

```bash
# 1. 상태 확인
cd /home/kim/projects/local-ai
git status
git diff

# 2. 변경사항 스테이징
git add <변경된 파일들>

# 3. 커밋 (HEREDOC 사용)
git commit -m "$(cat <<'EOF'
<type>: <description>

<body if needed>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"

# 4. 푸시
git push origin main
```

### 커밋 타입
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `refactor`: 코드 리팩토링
- `style`: 코드 포맷팅
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 변경

## 프로젝트 구조

```
/home/kim/projects/local-ai/
├── backend/          # NestJS 백엔드 (포트 3001)
├── frontend/         # React + Vite 프론트엔드 (포트 5173)
├── docker-compose.yml
└── README.md
```

## 개발 서버 실행

Node.js는 nvm으로 설치됨. PATH 설정 필요:

```bash
# 프론트엔드
cd /home/kim/projects/local-ai/frontend
PATH="/home/kim/.nvm/versions/node/v24.13.0/bin:$PATH" npx vite --host

# 백엔드
cd /home/kim/projects/local-ai/backend
PATH="/home/kim/.nvm/versions/node/v24.13.0/bin:$PATH" npm run start:dev
```

## 주요 포트

| 서비스 | 포트 |
|--------|------|
| Frontend (Vite) | 5173 |
| Backend (NestJS) | 3001 |
| PostgreSQL | 5432 |
| Ollama | 11434 |

## 기술 스택

- **Backend**: NestJS, Prisma, PostgreSQL, Ollama
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS
