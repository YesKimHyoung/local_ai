import { useState } from 'react';
import { compareModels } from '../lib/api';
import type { ModelResponse } from '../lib/api';

export function useAiCompare() {
  const [responses, setResponses] = useState<ModelResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = async (query: string) => {
    setLoading(true);
    setError(null);
    setResponses([]);
    try {
      const results = await compareModels(query);
      setResponses(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { responses, loading, error, compare };
}
