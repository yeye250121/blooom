export default function FeatureList() {
  return (
    <section className="feature-list">
      <div className="feature-container">
        <p className="point-text">
          <span className="text-darkblue">AI가 이상 상황을 감지</span>하면
          <br /> 긴급 알림 시스템
        </p>
        <div className="feature-item">
          <div className="feature-content">
            <h3>AI 기반 실시간 이상 감지</h3>
            <p>
              <span className="text-darkblue">인공지능이 실시간으로</span> 이상
              상황을 감지하여 즉각 알림을 제공합니다
            </p>
          </div>
          <img
            src="https://cdn.ajd.kr/images/platform/landing/cctv/lg_contents1.webp"
            alt="AI 기반 실시간 이상 감지"
          />
        </div>
        <div className="feature-item">
          <div className="feature-content">
            <h3>고해상도 영상 촬영 및 저장</h3>
            <p>
              <span className="text-darkblue">고해상도의 영상을 대용량 저장</span>{' '}
              공간을
              <br /> 통해 장기간 보관할 수 있습니다
            </p>
          </div>
          <img
            src="https://cdn.ajd.kr/images/platform/landing/cctv/lg_contents2.webp"
            alt="고해상도 영상 촬영 및 저장"
          />
        </div>
        <div className="feature-item">
          <div className="feature-content">
            <h3>원격 모니터링 및 제어 기능</h3>
            <p>
              <span className="text-darkblue">
                원격으로 카메라의 방향 조절 및 설정
              </span>
              이 변경 가능합니다
            </p>
          </div>
          <img
            src="https://cdn.ajd.kr/images/platform/landing/cctv/lg_contents3.webp"
            alt="원격 모니터링 및 제어 기능"
          />
        </div>
      </div>
    </section>
  );
}
