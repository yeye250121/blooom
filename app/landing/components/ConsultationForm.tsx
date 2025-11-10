'use client';

import Script from 'next/script';

export default function ConsultationForm() {
  return (
    <>
      <section className="form-container">
        <div id="successMessage" className="success-container">
          <div className="success-checkmark">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="40" fill="#0099FF"/>
              <path d="M24 40L34 50L56 28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="success-title">상담 신청 완료</h2>
          <p className="success-subtitle">전문 상담사가 곧 연락 드릴거에요!</p>
        </div>

        <div id="errorMessage" className="message error"></div>

        <form id="consultationForm">
          {/* Step 1: 전화번호 */}
          <div className="form-step active" data-step="1">
            <h2 className="form-title">상담을 위해<br />전화번호를 입력해주세요.</h2>

            <div className="form-group">
              <label htmlFor="phoneNumber">
                전화번호 <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                aria-label="휴대폰 번호"
                inputMode="numeric"
                pattern="[0-9-]*"
                placeholder="010-1234-5678"
                required
              />
              <div className="error-message" id="phoneError">
                올바른 전화번호를 입력해주세요
              </div>
            </div>
          </div>

          {/* Step 2: 설치지역 */}
          <div className="form-step" data-step="2">
            <button type="button" className="back-button" id="step2Prev" aria-label="이전 단계">
              ‹
            </button>

            <h2 className="form-title">설치 지역을 입력해주세요.</h2>

            <div className="form-group">
              <label htmlFor="installLocation">
                설치 지역 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="installLocation"
                name="installLocation"
                placeholder="예: 서울시 강남구"
                required
              />
              <div className="error-message" id="locationError">
                설치 지역을 입력해주세요
              </div>
            </div>

            <div className="button-group">
              <button type="button" className="btn btn-primary" id="step2Next">
                다음
              </button>
            </div>
          </div>

          {/* Step 3: 설치대수 */}
          <div className="form-step" data-step="3">
            <button type="button" className="back-button" id="step3Prev" aria-label="이전 단계">
              ‹
            </button>

            <h2 className="form-title">설치 대수를 입력해주세요.</h2>
            <p className="form-subtitle">정확하지 않아도 괜찮아요!</p>

            <div className="form-group">
              <label htmlFor="installCount">
                설치 대수 <span className="required">*</span>
              </label>
              <input
                type="number"
                id="installCount"
                name="installCount"
                inputMode="numeric"
                pattern="[0-9]*"
                min="1"
                max="100"
                placeholder="예: 1"
                required
              />
              <div className="error-message" id="countError">
                설치 대수를 입력해주세요 (1~100)
              </div>
            </div>

            <div className="button-group">
              <button type="button" className="btn btn-primary" id="step3Next">
                다음
              </button>
            </div>
          </div>

          {/* Step 4: 개인정보 동의 & 제출 */}
          <div className="form-step" data-step="4">
            <button type="button" className="back-button" id="step4Prev" aria-label="이전 단계">
              ‹
            </button>

            <h2 className="form-title">개인정보 동의</h2>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="privacyConsent"
                  name="privacyConsent"
                  required
                />
                <span>
                  <a href="/policies" target="_blank" className="privacy-link">
                    개인정보 처리방침
                  </a>
                  에 동의합니다. <span className="required">*</span>
                </span>
              </label>
              <div className="error-message" id="consentError">
                개인정보 처리방침에 동의해주세요
              </div>
            </div>

            <div
              style={{
                background: '#F7F9FC',
                padding: '20px',
                borderRadius: '9px',
                margin: '20px 0',
              }}
            >
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>
                입력하신 정보
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-gray)',
                  marginBottom: '6px',
                }}
              >
                <strong>전화번호:</strong> <span id="summaryPhone"></span>
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-gray)',
                  marginBottom: '6px',
                }}
              >
                <strong>설치 지역:</strong> <span id="summaryLocation"></span>
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-gray)' }}>
                <strong>설치 대수:</strong> <span id="summaryCount"></span>대
              </p>
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary" id="submitBtn">
                상담 신청하기
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Form JavaScript */}
      <Script id="form-script" strategy="afterInteractive">
        {`
        // API Base URL - 설정에서 가져오기
        const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || '';

        // 유입 URL 추적 (최초 1회만 저장)
        // 비유: 손님이 우리 가게에 처음 들어올 때 "어디서 오셨어요?"를 물어보는 것과 같습니다
        function getOrSetReferrerUrl() {
            const STORAGE_KEY = 'initial_referrer';
            
            // 이미 저장된 최초 유입 URL이 있으면 그것을 사용
            let storedReferrer = sessionStorage.getItem(STORAGE_KEY);
            
            if (!storedReferrer) {
                // document.referrer = 직전 페이지 URL (브라우저가 자동으로 제공)
                const referrer = document.referrer;
                const currentUrl = window.location.href;
                
                // UTM 파라미터 추출 (마케팅 캠페인 추적용)
                const urlParams = new URLSearchParams(window.location.search);
                const utmSource = urlParams.get('utm_source');
                const utmMedium = urlParams.get('utm_medium');
                const utmCampaign = urlParams.get('utm_campaign');
                
                // 유입 정보 구성
                let referrerInfo = '';
                
                if (referrer && referrer !== currentUrl) {
                    // 다른 사이트에서 유입된 경우
                    referrerInfo = referrer;
                } else if (utmSource) {
                    // UTM 파라미터가 있는 경우 (광고 클릭 등)
                    referrerInfo = \`UTM: \${utmSource}\`;
                    if (utmMedium) referrerInfo += \` / \${utmMedium}\`;
                    if (utmCampaign) referrerInfo += \` / \${utmCampaign}\`;
                } else {
                    // 직접 접속 또는 북마크
                    referrerInfo = '직접 접속';
                }
                
                // sessionStorage에 저장 (탭을 닫을 때까지 유지)
                sessionStorage.setItem(STORAGE_KEY, referrerInfo);
                storedReferrer = referrerInfo;
            }
            
            return storedReferrer;
        }

        // Form state
        let currentStep = 1;
        const formData = {
            referrerUrl: getOrSetReferrerUrl(), // 최초 유입 URL 사용
            phoneNumber: '',
            installLocation: '',
            installCount: 0,
            privacyConsent: false,
            submittedAt: null
        };

        // Elements
        const form = document.getElementById('consultationForm');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');

        // Input fields
        const phoneNumberInput = document.getElementById('phoneNumber');
        const installLocationInput = document.getElementById('installLocation');
        const installCountInput = document.getElementById('installCount');
        const privacyConsentCheckbox = document.getElementById('privacyConsent');

        // Error messages
        const phoneError = document.getElementById('phoneError');
        const locationError = document.getElementById('locationError');
        const countError = document.getElementById('countError');
        const consentError = document.getElementById('consentError');

        // Buttons
        const step2Prev = document.getElementById('step2Prev');
        const step2Next = document.getElementById('step2Next');
        const step3Prev = document.getElementById('step3Prev');
        const step3Next = document.getElementById('step3Next');
        const step4Prev = document.getElementById('step4Prev');
        const submitBtn = document.getElementById('submitBtn');

        // Phone number auto formatting and auto advance
        phoneNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');

            if (value.length <= 3) {
                e.target.value = value;
            } else if (value.length <= 7) {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3);
            } else if (value.length <= 11) {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
            } else {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
            }

            // Auto advance to step 2 when phone is valid
            const phone = e.target.value.trim();
            if (validatePhone(phone) && currentStep === 1) {
                phoneNumberInput.classList.remove('error');
                phoneError.classList.remove('show');
                formData.phoneNumber = phone;

                setTimeout(() => {
                    goToStep(2);
                }, 300);
            }
        });

        // Validation functions
        function validatePhone(phone) {
            const phonePattern = /^(01[0-9]|02|0[3-6][0-9]|070)-?[0-9]{3,4}-?[0-9]{4}$/;
            return phonePattern.test(phone.replace(/\\s/g, ''));
        }

        function validateLocation(location) {
            return location && location.trim().length >= 2;
        }

        function validateCount(count) {
            const num = parseInt(count);
            return !isNaN(num) && num >= 1 && num <= 100;
        }

        // Step navigation
        function goToStep(step) {
            // Hide all steps
            document.querySelectorAll('.form-step').forEach(el => {
                el.classList.remove('active');
            });

            // Show target step
            document.querySelector(\`.form-step[data-step="\${step}"]\`).classList.add('active');

            currentStep = step;

            // Update summary on step 4
            if (step === 4) {
                document.getElementById('summaryPhone').textContent = formData.phoneNumber;
                document.getElementById('summaryLocation').textContent = formData.installLocation;
                document.getElementById('summaryCount').textContent = formData.installCount;
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Step 2 -> Step 1
        step2Prev.addEventListener('click', function() {
            goToStep(1);
        });

        // Step 2 -> Step 3
        step2Next.addEventListener('click', function() {
            const location = installLocationInput.value.trim();

            if (!validateLocation(location)) {
                installLocationInput.classList.add('error');
                locationError.classList.add('show');
                return;
            }

            installLocationInput.classList.remove('error');
            locationError.classList.remove('show');
            formData.installLocation = location;

            goToStep(3);
        });

        // Step 3 -> Step 2
        step3Prev.addEventListener('click', function() {
            goToStep(2);
        });

        // Step 3 -> Step 4
        step3Next.addEventListener('click', function() {
            const count = installCountInput.value;

            if (!validateCount(count)) {
                installCountInput.classList.add('error');
                countError.classList.add('show');
                return;
            }

            installCountInput.classList.remove('error');
            countError.classList.remove('show');
            formData.installCount = parseInt(count);

            goToStep(4);
        });

        // Step 4 -> Step 3
        step4Prev.addEventListener('click', function() {
            goToStep(3);
        });

        // Message functions
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
        }

        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate consent
            if (!privacyConsentCheckbox.checked) {
                consentError.classList.add('show');
                return;
            }

            consentError.classList.remove('show');
            formData.privacyConsent = true;
            formData.submittedAt = new Date().toISOString();

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span>제출 중...';

            // Prepare API request
            const requestData = {
                referrerUrl: formData.referrerUrl,
                phoneNumber: formData.phoneNumber.replace(/[^0-9]/g, ''),
                installLocation: formData.installLocation,
                installCount: formData.installCount,
                privacyConsent: formData.privacyConsent,
                submittedAt: formData.submittedAt
            };

            try {
                const response = await fetch(\`\${API_BASE_URL}/api/inquiry\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Success - hide form and show success message
                    form.style.display = 'none';
                    successMessage.style.display = 'flex';

                    // Track events
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'Lead', {
                            content_name: 'Consultation Request',
                            value: 0,
                            currency: 'KRW'
                        });
                    }

                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'generate_lead', {
                            event_category: 'engagement',
                            event_label: 'consultation_form'
                        });
                    }

                    if (typeof kakaoPixel !== 'undefined') {
                        kakaoPixel('4341098074617891089').completeRegistration();
                    }

                } else {
                    showError(data.message || '상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
                }

            } catch (error) {
                console.error('Error:', error);
                showError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '상담 신청하기';
            }
        });

        // UTM parameters
        (function() {
            const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
            const urlParams = new URLSearchParams(window.location.search);

            utmParams.forEach(param => {
                const value = urlParams.get(param);
                if (value) {
                    sessionStorage.setItem(param, value);
                }
            });
        })();
        `}
      </Script>
    </>
  );
}
