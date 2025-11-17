'use client'

// 수수료 대시보드는 가계부처럼 날짜·금액·상태를 한눈에 정리하는 것이 핵심입니다.
const payoutSchedule = {
  nextDate: '2024-11-15',
  nextAmount: 420000,
  note: '전월 확정 건 일괄 지급 예정',
}

const payoutHistory = [
  { id: 1, date: '2024-10-28', amount: 380000, memo: '10월 3주차 확정분', status: '지급완료' },
  { id: 2, date: '2024-10-21', amount: 250000, memo: '고객 설치 완료분 지급', status: '지급완료' },
  { id: 3, date: '2024-10-14', amount: 195000, memo: '직접 계약 2건 확정', status: '지급완료' },
]

export default function CommissionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">수수료 관리</h1>
      <p className="text-gray-600 mb-8">
        다음 지급일과 최근 지급 내역을 확인하고, 필요한 메모를 곧바로 남겨보세요.
      </p>

      <section className="grid gap-6 grid-cols-1 lg:grid-cols-3 mb-10">
        <div className="bg-white rounded-2xl shadow p-6 border">
          <h3 className="text-gray-500 text-sm font-medium">다음 지급일</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{payoutSchedule.nextDate}</p>
          <p className="text-sm text-gray-600 mt-3">{payoutSchedule.note}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border">
          <h3 className="text-gray-500 text-sm font-medium">예정 금액</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {payoutSchedule.nextAmount.toLocaleString()}원
          </p>
          <p className="text-sm text-gray-600 mt-3">확정 상태 기준</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border">
          <h3 className="text-gray-500 text-sm font-medium">최근 지급</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {payoutHistory[0].amount.toLocaleString()}원
          </p>
          <p className="text-sm text-gray-600 mt-3">{payoutHistory[0].date}</p>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow overflow-hidden border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">지급 내역</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  지급일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  비고
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payoutHistory.map((history) => (
                <tr key={history.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{history.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {history.amount.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{history.memo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {history.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
