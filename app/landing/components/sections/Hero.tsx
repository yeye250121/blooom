interface HeroProps {
  logoSrc?: string;
  logoAlt?: string;
  logoHeight?: number;
}

const defaultProps: HeroProps = {
  logoSrc: 'https://i.namu.wiki/i/g-8tEhqgrMv-DLrASvSM-7pgsPos9qX1Lpx3VVOGRYTTZpgtUnWbMEsw7DLDuU7ecjtrkl6nqnCrFqxepgRU1A.svg',
  logoAlt: 'KT',
  logoHeight: 50,
};

export default function Hero(props: HeroProps = {}) {
  const { logoSrc, logoAlt, logoHeight } = { ...defaultProps, ...props };

  return (
    <section className="hero">
      <div className="logo">
        <img
          src={logoSrc}
          alt={logoAlt}
          style={{ height: `${logoHeight}px`, width: 'auto' }}
        />
      </div>
    </section>
  );
}
