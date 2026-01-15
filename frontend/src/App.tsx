import { useState } from 'react';
import { QueryForm } from './components/QueryForm';
import { ResponseCard } from './components/ResponseCard';
import { HistoryList } from './components/HistoryList';
import { useAiCompare } from './hooks/useAiCompare';

type Tab = 'compare' | 'history';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('compare');
  const { responses, loading, error, compare } = useAiCompare();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Multi AI Comparer
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            4개의 로컬 AI 모델 응답을 비교해보세요
          </p>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('compare')}
              className={`py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'compare'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              질문하기
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              히스토리
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'compare' ? (
          <div className="space-y-8">
            <QueryForm onSubmit={compare} loading={loading} />

            {error && (
              <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">모델들이 응답을 생성하고 있습니다...</p>
              </div>
            )}

            {responses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {responses.map((resp, idx) => (
                  <ResponseCard key={idx} response={resp} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <HistoryList />
        )}
      </main>
    </div>
  );
}

export default App;
