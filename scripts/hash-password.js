const bcrypt = require('bcryptjs');

// 원하는 비밀번호 입력
const plainPassword = '1234'; // 실제 비밀번호로 변경하세요

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error('해시 생성 실패:', err);
    return;
  }
  console.log('해시된 비밀번호:');
  console.log(hash);
  console.log('\n이 값을 Supabase에서 password_hash 컬럼에 업데이트하세요.');
});
