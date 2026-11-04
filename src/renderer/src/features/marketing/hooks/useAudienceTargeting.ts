import { useState, useEffect } from 'react';
import { api } from '../../../api-bridge';
import { AudienceFilter } from '../types/marketing.types';

export function useAudienceTargeting(filter: AudienceFilter) {
  const [estimatedCount, setEstimatedCount] = useState<number>(0);
  const [isEstimating, setIsEstimating] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchEstimate = async () => {
      setIsEstimating(true);
      try {
        const res = await api.campaigns.estimateAudience(filter);
        if (isMounted) {
          setEstimatedCount(res.count);
        }
      } catch (err) {
        console.error('Failed to estimate audience:', err);
      } finally {
        if (isMounted) setIsEstimating(false);
      }
    };

    const timer = setTimeout(fetchEstimate, 250);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [filter.all, filter.city, filter.minOrders, JSON.stringify(filter.tags)]);

  return { estimatedCount, isEstimating };
}

