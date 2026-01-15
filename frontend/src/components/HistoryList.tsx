import { useEffect, useState } from 'react';
import { getHistory, getHistoryById } from '../lib/api';
import type { HistoryItem, HistoryDetail } from '../lib/api';
import { ResponseCard } from './ResponseCard';

export function HistoryList() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(50, 0);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = async (id: number) => {
    try {
      const detail = await getHistoryById(id);
      setSelectedDetail(detail);
    } catch (err) {
      console.error('Failed to load detail:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ko-KR');
  };

  if (selectedDetail) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <button
          onClick={() => setSelectedDetail(null)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
        >
          &larr; 목록으로 돌아가기
        </button>
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600 text-sm">{formatDate(selectedDetail.createdAt)}</p>
          <p className="text-gray-800 font-medium mt-2">{selectedDetail.query}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedDetail.responses.map((resp, idx) => (
            <ResponseCard key={idx} response={resp} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">질문 히스토리</h2>
      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500">아직 저장된 질문이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item.id)}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow border"
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-800 line-clamp-2 flex-1">{item.query}</p>
                <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                  {item.duration?.toFixed(2)}s
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-2">{formatDate(item.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
