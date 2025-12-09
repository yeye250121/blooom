import Link from 'next/link';

export interface PartnersCTAProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  ctaText?: string;
  ctaHref?: string;
}

const defaultProps: PartnersCTAProps = {
  title: (
    <>
      블룸과 함께<br />더 크게 성장해요
    </>
  ),
  description: '지금 바로 파트너가 되어보세요.',
  ctaText: '30초 만에 시작하기',
  ctaHref: '/partners/login',
};

export default function PartnersCTA(props: PartnersCTAProps = {}) {
  const { title, description, ctaText, ctaHref } = { ...defaultProps, ...props };

  return (
    <section className="bg-[#191f28] pt-32 lg:pt-40 pb-24 lg:pb-32">
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        <div className="animate-on-scroll opacity-0 translate-y-12 transition-all duration-700">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-white/60 text-lg mb-10">
            {description}
          </p>
          <Link
            href={ctaHref!}
            className="inline-flex items-center gap-2 bg-[#3182f6] hover:bg-[#1b64da] text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
          >
            {ctaText}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
