import AnalyticsContext from '@root/core/src/contexts/analytics-context';
import { useCallback, useContext, useEffect } from 'react';

export default function useAnalytics(eventPrefix, shouldTrackViewEvent = true) {
  const context = useContext(AnalyticsContext);

  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsContext.Provider');
  }

  const { analytics } = context;
  const track = useCallback((eventName, eventProps = {}) => {
    analytics.track(buildEventName(eventName), eventProps);
  }, [analytics, buildEventName]);

  const buildEventName = useCallback((event) => {
    if (typeof eventPrefix === 'string') {
      return `${eventPrefix}_${event}`;
    }

    if (typeof eventPrefix === 'function') {
      return eventPrefix(event);
    }

    throw new Error('Invalid event prefix given to useAnalytics hook');
  }, [eventPrefix]);

  useEffect(() => {
    if (shouldTrackViewEvent) {
      track('VIEWED');
    }
  }, [shouldTrackViewEvent, track]);

  return [track];
}
