#!/bin/bash

echo "=== 관리자 로그인 테스트 ==="
echo ""
echo "1. 로그인 API 호출"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "loginId": "siwwyy1012",
    "password": "1234"
  }' | jq

echo ""
echo ""
echo "2. 토큰을 사용하여 관리자 API 호출"
echo "위에서 받은 access_token을 복사하여 아래 명령어에 붙여넣으세요:"
echo ""
echo 'curl -X GET http://localhost:3000/api/admin/overview \'
echo '  -H "Authorization: Bearer YOUR_TOKEN_HERE" | jq'
