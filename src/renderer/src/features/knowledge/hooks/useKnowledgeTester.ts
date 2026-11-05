import { useState, useCallback } from 'react';
import { KnowledgeRetrievalTestResult } from '../types/knowledge.types';
import { knowledgeService } from '../services/knowledge.service';

export function useKnowledgeTester() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<KnowledgeRetrievalTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const runTest = useCallback(async (testQuery?: string) => {
    const q = (testQuery ?? query).trim();
    if (!q) return;
    setIsTesting(true);
    try {
      const res = await knowledgeService.testRetrieval(q);
      setResult(res);
    } finally {
      setIsTesting(false);
    }
  }, [query]);

  const clearTest = useCallback(() => {
    setQuery('');
    setResult(null);
  }, []);

  return {
    query,
    setQuery,
    result,
    isTesting,
    runTest,
    clearTest,
  };
}

