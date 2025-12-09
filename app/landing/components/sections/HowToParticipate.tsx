export interface StepItem {
  number: number;
  title: string;
}

interface HowToParticipateProps {
  header?: {
    title: string;
  };
  steps?: StepItem[];
}

const defaultSteps: StepItem[] = [
  { number: 1, title: '이 페이지에서 상담 신청하기' },
  { number: 2, title: '전문 상담사와 유선 상담 진행하기' },
  { number: 3, title: '혜택과 지원금 받기' },
];

const defaultProps: HowToParticipateProps = {
  header: {
    title: '참여 방법<br />아주 간단해요',
  },
  steps: defaultSteps,
};

export default function HowToParticipate(props: HowToParticipateProps = {}) {
  const { header, steps } = { ...defaultProps, ...props };

  return (
    <section className="how-to-participate">
      <div className="how-to-header">
        <h2 dangerouslySetInnerHTML={{ __html: header?.title || '' }} />
      </div>

      <div className="steps-container">
        {steps?.map((step) => (
          <div className="step-card" key={step.number}>
            <div className="step-item">
              <div className="step-number">
                <span>{step.number}</span>
              </div>
              <div className="step-text">
                <h3>{step.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
