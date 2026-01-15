#!/bin/bash

echo "=== Multi AI Comparer 설정 스크립트 ==="

# PostgreSQL 설치 확인
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL이 설치되어 있지 않습니다."
    echo "다음 명령으로 설치해주세요:"
    echo "  sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib"
    exit 1
fi

# PostgreSQL 서비스 시작
echo "PostgreSQL 서비스 시작 중..."
sudo systemctl start postgresql

# 데이터베이스 및 사용자 생성
echo "데이터베이스 설정 중..."
sudo -u postgres psql -c "CREATE USER kim WITH PASSWORD 'password';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE multiaicomparer OWNER kim;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE multiaicomparer TO kim;" 2>/dev/null || true

echo "PostgreSQL 설정 완료!"

# Backend 설정
echo "백엔드 설정 중..."
cd backend
npm install
npx prisma generate
npx prisma db push

echo ""
echo "=== 설정 완료 ==="
echo ""
echo "실행 방법:"
echo "  1. 터미널 1: cd backend && npm run start:dev"
echo "  2. 터미널 2: cd frontend && npm run dev"
echo ""
echo "웹 브라우저에서 http://localhost:5173 접속"
