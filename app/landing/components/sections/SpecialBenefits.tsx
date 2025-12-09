export interface BenefitItem {
  iconSrc: string;
  iconAlt: string;
  title: string;
  note?: string;
}

interface SpecialBenefitsProps {
  header?: {
    title: string;
  };
  benefits?: BenefitItem[];
  footer?: string;
}

const defaultBenefits: BenefitItem[] = [
  {
    iconSrc: 'https://framerusercontent.com/images/WvCRkoKM4v8y2R8Vfvb0YxW8vQ.png?width=615&height=642',
    iconAlt: '지원금',
    title: '자영업자 창업지원금<br />150만원',
    note: '(월 1회 1명 추첨)',
  },
  {
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/9166/9166553.png',
    iconAlt: '화재보험',
    title: '최대 5000만원 보장<br />매장 화재보험 가입',
    note: '(100% 전원 지급)',
  },
];

const defaultProps: SpecialBenefitsProps = {
  header: {
    title: '여기서만 받을 수 있는<br />특별 혜택!',
  },
  benefits: defaultBenefits,
  footer: '도입 후 설치 완료 시',
};

export default function SpecialBenefits(props: SpecialBenefitsProps = {}) {
  const { header, benefits, footer } = { ...defaultProps, ...props };

  return (
    <section className="special-benefits">
      <div className="benefits-header">
        <h2 dangerouslySetInnerHTML={{ __html: header?.title || '' }} />
      </div>

      <div className="benefits-grid">
        {benefits?.map((benefit, index) => (
          <div className="benefit-card" key={index}>
            <div className="benefit-icon">
              <img src={benefit.iconSrc} alt={benefit.iconAlt} />
            </div>
            <div className="benefit-content">
              <h3 dangerouslySetInnerHTML={{ __html: benefit.title }} />
              {benefit.note && <p className="benefit-note">{benefit.note}</p>}
            </div>
          </div>
        ))}
      </div>

      {footer && <p className="benefits-footer">{footer}</p>}
    </section>
  );
}
