'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number; // 애니메이션 지속 시간 (ms)
  suffix?: string; // 숫자 뒤에 붙을 텍스트 (예: "+")
  className?: string;
}

export default function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCount = () => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // 커스텀 이징: 처음엔 빠르게, 끝에 가까워질수록 점점 느려짐
      // easeOutQuart보다 더 극적인 감속
      const easeOutQuint = 1 - Math.pow(1 - progress, 5);
      const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuint);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  };

  // 숫자에 콤마 추가
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <span ref={counterRef} className={className}>
      {formatNumber(count)}{suffix}
    </span>
  );
}
