export default function SpecialBenefits() {
  return (
    <section className="special-benefits">
      <div className="benefits-header">
        <h2>여기서만 받을 수 있는<br />특별 혜택!</h2>
      </div>

      <div className="benefits-grid">
        <div className="benefit-card">
          <div className="benefit-icon">
            <img src="https://framerusercontent.com/images/WvCRkoKM4v8y2R8Vfvb0YxW8vQ.png?width=615&height=642" alt="지원금" />
          </div>
          <div className="benefit-content">
            <h3>자영업자 창업지원금<br />150만원</h3>
            <p className="benefit-note">(월 1회 1명 추첨)</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/9166/9166553.png" alt="화재보험" />
          </div>
          <div className="benefit-content">
            <h3>최대 5000만원 보장<br />매장 화재보험 가입</h3>
            <p className="benefit-note">(100% 전원 지급)</p>
          </div>
        </div>
      </div>

      <p className="benefits-footer">도입 후 설치 완료 시</p>
    </section>
  );
}
