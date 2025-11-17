const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// .env.local 파일 읽기
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const userId = 'ba9887c6-bcfc-4560-95d4-513aa73b32e2';
const hashedPassword = '$2b$10$dMqCtmNqdgxMuZjxpQznAu.39ED3buG7ZY9DafwkI28YwYYL7UtQu'; // 비밀번호: 1234

async function updatePassword() {
  try {
    // 현재 사용자 정보 확인
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('사용자 조회 실패:', fetchError);
      return;
    }

    console.log('현재 사용자 정보:');
    console.log(user);
    console.log('\n------------------------\n');

    // 비밀번호 업데이트
    const { data, error } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('업데이트 실패:', error);
      return;
    }

    console.log('✅ 비밀번호 업데이트 성공!');
    console.log('업데이트된 사용자:', data);
    console.log('\n로그인 정보:');
    console.log(`- 아이디: ${user.login_id}`);
    console.log('- 비밀번호: 1234');
  } catch (err) {
    console.error('오류 발생:', err);
  }
}

updatePassword();
