import { redirect } from 'next/navigation';

export default function HomePage() {
  // redirect 함수는 건물 입구 안내 데스크가 방문객을 필요한 창 saloon으로 즉시 안내하는 것처럼, 사용자를 파트너 로그인으로 곧바로 이동시킵니다.
  redirect('/partners/login');
  return null;
}
