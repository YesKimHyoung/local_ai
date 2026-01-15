const API_BASE = 'http://localhost:3001/api';

export interface ModelResponse {
  model: string;
  response: string;
  time: number;
  error?: string;
}

export interface HistoryItem {
  id: number;
  query: string;
  createdAt: string;
  duration: number;
}

export interface HistoryDetail extends HistoryItem {
  responses: ModelResponse[];
  ipAddress?: string;
}

export async function compareModels(query: string): Promise<ModelResponse[]> {
  console.log('[API] Sending compare request:', query);
  try {
    const res = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    console.log('[API] Response status:', res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[API] Error response:', errorText);
      throw new Error(`Failed to compare models: ${res.status}`);
    }
    const data = await res.json();
    console.log('[API] Response data:', data);
    return data;
  } catch (error) {
    console.error('[API] Fetch error:', error);
    throw error;
  }
}

export async function getHistory(limit = 50, offset = 0): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/history?limit=${limit}&offset=${offset}`);
  if (!res.ok) {
    throw new Error('Failed to fetch history');
  }
  return res.json();
}

export async function getHistoryById(id: number): Promise<HistoryDetail> {
  const res = await fetch(`${API_BASE}/history/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch history detail');
  }
  return res.json();
}
