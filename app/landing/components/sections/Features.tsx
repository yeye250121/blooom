export interface FeatureItem {
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  description?: string;
}

interface FeaturesProps {
  features?: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
  {
    title: '소중한 내 공간,<br />믿을만한 CCTV로 안전하게',
  },
  {
    imageSrc: 'https://www.kpscctv.co.kr/images/sub/sub2-1-img.jpg',
    imageAlt: 'CCTV 이미지',
    title: 'KT텔레캅은 믿을 수 있어요',
    description: 'CCTV는 이제 필수입니다',
  },
];

const defaultProps: FeaturesProps = {
  features: defaultFeatures,
};

export default function Features(props: FeaturesProps = {}) {
  const { features } = { ...defaultProps, ...props };

  return (
    <section className="features">
      {features?.map((feature, index) => (
        <div className="feature" key={index}>
          {feature.imageSrc && (
            <img src={feature.imageSrc} alt={feature.imageAlt || ''} />
          )}
          <h2 dangerouslySetInnerHTML={{ __html: feature.title }} />
          {feature.description && <p>{feature.description}</p>}
        </div>
      ))}
    </section>
  );
}
