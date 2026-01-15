import type { ModelResponse } from '../lib/api';

interface ResponseCardProps {
  response: ModelResponse;
}

const modelColors: Record<string, string> = {
  'deepseek-r1:8b': 'border-purple-500',
  'qwen2.5:14b': 'border-green-500',
  'gemma3:4b': 'border-blue-500',
  'llama3.1:8b': 'border-orange-500',
};

const modelDisplayNames: Record<string, string> = {
  'deepseek-r1:8b': 'DeepSeek R1 (8B)',
  'qwen2.5:14b': 'Qwen 2.5 (14B)',
  'gemma3:4b': 'Gemma 3 (4B)',
  'llama3.1:8b': 'Llama 3.1 (8B)',
};

export function ResponseCard({ response }: ResponseCardProps) {
  const borderColor = modelColors[response.model] || 'border-gray-500';
  const displayName = modelDisplayNames[response.model] || response.model;

  return (
    <div className={`bg-white rounded-lg shadow-md border-t-4 ${borderColor} overflow-hidden`}>
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{displayName}</h3>
          <span className="text-sm text-gray-500">
            {response.time.toFixed(2)}s
          </span>
        </div>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        {response.error ? (
          <p className="text-red-500">{response.error}</p>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{response.response}</p>
        )}
      </div>
    </div>
  );
}
