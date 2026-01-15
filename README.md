# Multi AI Comparer

한 번의 질문으로 4개의 로컬 AI 모델(Ollama) 응답을 동시에 비교할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- **4개 AI 모델 동시 비교**: 하나의 질문을 4개 모델에 병렬로 전송하여 응답 비교
- **응답 시간 측정**: 각 모델별 응답 소요 시간 표시
- **질문 히스토리**: PostgreSQL에 질문과 응답 기록 저장
- **히스토리 조회**: 이전 질문과 응답 내역 확인 가능

## 지원 모델

| 모델 | 파라미터 |
|------|----------|
| DeepSeek R1 | 8B |
| Qwen 2.5 | 14B |
| Gemma 3 | 4B |
| Llama 3.1 | 8B |

## 기술 스택

### Backend
- **NestJS 10.x** - Node.js 프레임워크
- **Prisma 5.x** - ORM
- **PostgreSQL 16** - 데이터베이스
- **Ollama** - 로컬 AI 모델 서버

### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링

## 시스템 요구사항

- **Node.js** 18.x 이상
- **PostgreSQL** 14 이상
- **Ollama** 설치 및 실행
- **RAM** 최소 16GB 권장 (AI 모델 실행용)

## 설치 방법

### 1. 저장소 클론

```bash
git clone https://github.com/YesKimHyoung/local_ai.git
cd local_ai
```

### 2. Ollama 설치 및 모델 다운로드

```bash
# Ollama 설치 (Linux)
curl -fsSL https://ollama.com/install.sh | sh

# 모델 다운로드
ollama pull deepseek-r1:8b
ollama pull qwen2.5:14b
ollama pull gemma3:4b
ollama pull llama3.1:8b
```

### 3. PostgreSQL 설정

#### 방법 A: Docker 사용 (권장)

```bash
docker-compose up -d
```

#### 방법 B: 직접 설치

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# PostgreSQL 서비스 시작
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 데이터베이스 및 사용자 생성
sudo -u postgres psql -c "CREATE USER kim WITH PASSWORD 'password';"
sudo -u postgres psql -c "CREATE DATABASE multiaicomparer OWNER kim;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE multiaicomparer TO kim;"
```

### 4. Backend 설정

```bash
cd backend

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일을 열어 DATABASE_URL 수정 (필요시)

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 스키마 적용
npx prisma db push
```

### 5. Frontend 설정

```bash
cd frontend

# 의존성 설치
npm install
```

## 실행 방법

### 1. Ollama 서버 실행

```bash
ollama serve
```
> 기본 포트: 11434

### 2. Backend 실행

```bash
cd backend
npm run start:dev
```
> 서버 주소: http://localhost:3001

### 3. Frontend 실행

```bash
cd frontend
npm run dev
```
> 웹 UI 주소: http://localhost:5173

### 4. 브라우저에서 접속

http://localhost:5173 으로 접속하여 사용

## 환경 변수

### Backend (.env)

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | `postgresql://kim:password@localhost:5432/multiaicomparer?schema=public` |
| `OLLAMA_HOST` | Ollama 서버 주소 | `http://localhost:11434` |
| `PORT` | 백엔드 서버 포트 | `3001` |

## API 엔드포인트

### POST /api/compare

4개 모델에 질문을 전송하고 응답을 비교합니다.

**Request Body:**
```json
{
  "query": "인공지능이란 무엇인가요?"
}
```

**Response:**
```json
[
  {
    "model": "deepseek-r1:8b",
    "response": "인공지능(AI)은...",
    "time": 12.34
  },
  {
    "model": "qwen2.5:14b",
    "response": "AI란...",
    "time": 15.67
  },
  ...
]
```

### GET /api/history

질문 히스토리 목록을 조회합니다.

**Query Parameters:**
| 파라미터 | 설명 | 기본값 |
|----------|------|--------|
| `limit` | 조회할 최대 개수 | 50 |
| `offset` | 건너뛸 개수 | 0 |

**Response:**
```json
[
  {
    "id": 1,
    "query": "인공지능이란?",
    "createdAt": "2026-01-16T12:00:00.000Z",
    "duration": 45.23
  },
  ...
]
```

### GET /api/history/:id

특정 질문의 상세 정보를 조회합니다.

**Response:**
```json
{
  "id": 1,
  "query": "인공지능이란?",
  "createdAt": "2026-01-16T12:00:00.000Z",
  "duration": 45.23,
  "responses": [
    {
      "model": "deepseek-r1:8b",
      "response": "...",
      "time": 12.34
    },
    ...
  ]
}
```

## 프로젝트 구조

```
local_ai/
├── backend/                    # NestJS 백엔드
│   ├── src/
│   │   ├── ai/                 # AI 비교 모듈
│   │   │   ├── ai.controller.ts    # API 컨트롤러
│   │   │   ├── ai.service.ts       # 비즈니스 로직
│   │   │   └── ai.module.ts        # 모듈 정의
│   │   ├── prisma/             # Prisma 서비스
│   │   │   ├── prisma.service.ts
│   │   │   └── prisma.module.ts
│   │   ├── app.module.ts       # 앱 모듈
│   │   └── main.ts             # 진입점
│   ├── prisma/
│   │   └── schema.prisma       # DB 스키마
│   └── .env.example            # 환경변수 예시
│
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── components/         # UI 컴포넌트
│   │   │   ├── QueryForm.tsx       # 질문 입력 폼
│   │   │   ├── ResponseCard.tsx    # 응답 카드
│   │   │   └── HistoryList.tsx     # 히스토리 목록
│   │   ├── hooks/
│   │   │   └── useAiCompare.ts     # AI 비교 훅
│   │   ├── lib/
│   │   │   └── api.ts              # API 클라이언트
│   │   ├── App.tsx             # 메인 앱 컴포넌트
│   │   └── main.tsx            # 진입점
│   └── vite.config.ts          # Vite 설정
│
├── docker-compose.yml          # Docker 설정 (PostgreSQL)
├── setup.sh                    # 설정 스크립트
└── README.md                   # 이 파일
```

## 데이터베이스 스키마

```prisma
model QueryLog {
  id        Int      @id @default(autoincrement())
  query     String   // 사용자 질문
  createdAt DateTime @default(now())
  ipAddress String?  // 요청 IP (옵션)
  responses Json     // 모델별 응답 배열
  duration  Float?   // 전체 소요 시간 (초)
}
```

## 트러블슈팅

### API 응답이 느린 경우

4개의 AI 모델이 병렬로 응답을 생성하므로 **30~60초** 정도 소요될 수 있습니다.

**디버깅 방법:**
1. 브라우저에서 F12 눌러 개발자 도구 열기
2. Console 탭에서 `[API]` 로그 확인
3. Network 탭에서 `/api/compare` 요청 상태 확인

### Ollama 연결 오류

```
Error: connect ECONNREFUSED 127.0.0.1:11434
```

**해결방법:** Ollama 서버가 실행 중인지 확인
```bash
ollama serve
```

### 모델을 찾을 수 없음

```
Error: model 'deepseek-r1:8b' not found
```

**해결방법:** 해당 모델 다운로드
```bash
ollama pull deepseek-r1:8b
```

### PostgreSQL 연결 오류

```
Error: P1001: Can't reach database server
```

**해결방법:**
1. PostgreSQL 서비스 실행 확인
2. `.env` 파일의 `DATABASE_URL` 확인
3. 사용자 권한 확인

### 포트 충돌

백엔드나 프론트엔드 포트가 이미 사용 중인 경우:
- 백엔드: `.env`의 `PORT` 변경
- 프론트엔드: `vite.config.ts`에서 포트 변경

## 향후 개발 예정

- [ ] 실시간 스트리밍 응답
- [ ] 모델 선택 UI (사용자가 모델 선택)
- [ ] 프롬프트 템플릿 기능
- [ ] 응답 평가 (좋아요/싫어요)
- [ ] 사용자 인증/로그인

## 라이선스

MIT License

## 기여

이슈와 PR은 언제나 환영합니다!
