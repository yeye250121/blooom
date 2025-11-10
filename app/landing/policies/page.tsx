export default function PoliciesPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>개인정보 처리방침</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>1. 개인정보의 수집 및 이용 목적</h2>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
          이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </p>
        <ul style={{ marginTop: '10px', paddingLeft: '20px', lineHeight: '1.8', color: '#444' }}>
          <li>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</li>
          <li>회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지</li>
          <li>마케팅 및 광고에 활용: 이벤트 등 광고성 정보 전달, 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>2. 수집하는 개인정보의 항목</h2>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          회사는 상담 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
        </p>
        <ul style={{ marginTop: '10px', paddingLeft: '20px', lineHeight: '1.8', color: '#444' }}>
          <li>필수항목: 전화번호, 설치 지역, 설치 대수</li>
          <li>자동 수집 항목: 유입 경로(referrer URL), 접속 IP 정보, 쿠키, 서비스 이용 기록</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>3. 개인정보의 보유 및 이용기간</h2>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
          개인정보를 처리·보유합니다.
        </p>
        <ul style={{ marginTop: '10px', paddingLeft: '20px', lineHeight: '1.8', color: '#444' }}>
          <li>상담 신청 정보: 수집 후 3개월 또는 계약 종료 시까지</li>
          <li>마케팅 활용 동의 정보: 동의 철회 시까지</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>4. 개인정보의 제3자 제공</h2>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          회사는 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>5. 정보주체의 권리·의무 및 행사방법</h2>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
        </p>
        <ul style={{ marginTop: '10px', paddingLeft: '20px', lineHeight: '1.8', color: '#444' }}>
          <li>개인정보 열람 요구</li>
          <li>오류 등이 있을 경우 정정 요구</li>
          <li>삭제 요구</li>
          <li>처리정지 요구</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>6. 개인정보의 파기</h2>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
          전자적 파일 형태인 경우 복구 및 재생되지 않도록 안전하게 삭제하고, 그 밖에 기록물, 인쇄물, 서면 등의 경우 분쇄하거나 소각하여 파기합니다.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>7. 개인정보 보호책임자</h2>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
          아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ lineHeight: '1.8', color: '#444' }}>
            <strong>개인정보 보호책임자</strong><br />
            회사명: 제이앤유통<br />
            전화: 010-7469-4385<br />
            주소: 경상남도 창원시 의창구 사화로 80번길 20, 201호
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>8. 개인정보 처리방침의 변경</h2>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          이 개인정보 처리방침은 2024년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
          변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
        </p>
      </section>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#0099FF',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          홈으로 돌아가기
        </a>
      </div>
    </main>
  );
}
