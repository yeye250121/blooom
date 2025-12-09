interface FooterSection {
  title?: string;
  lines: string[];
  links?: { text: string; href: string; target?: string }[];
}

interface FooterProps {
  companyName?: string;
  sections?: FooterSection[];
}

const defaultSections: FooterSection[] = [
  {
    title: '케어온',
    lines: [
      '사업자 등록번호: 609-41-95762',
      '경상남도 창원시 진해구 여명로25번나길 27, 1동 301호',
    ],
  },
  {
    title: '고객센터',
    lines: ['전화: 010-7469-4385'],
  },
  {
    lines: [],
    links: [{ text: '개인정보 처리방침', href: '/policies', target: '_blank' }],
  },
];

const defaultProps: FooterProps = {
  sections: defaultSections,
};

export default function Footer(props: FooterProps = {}) {
  const { sections } = { ...defaultProps, ...props };

  return (
    <footer className="footer">
      <div className="footer-content">
        {sections?.map((section, index) => (
          <div className="footer-section" key={index}>
            {section.title && <h3>{section.title}</h3>}
            {section.lines.map((line, lineIndex) => (
              <p key={lineIndex}>{line}</p>
            ))}
            {section.links?.map((link, linkIndex) => (
              <p key={linkIndex}>
                <a href={link.href} target={link.target}>
                  {link.text}
                </a>
              </p>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
