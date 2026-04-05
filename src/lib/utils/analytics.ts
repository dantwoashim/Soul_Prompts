export type AnalyticsEvent =
  | 'Copy Prompt'
  | 'Waitlist Submit'
  | 'Character Page View'
  | 'FAQ Open'
  | 'Buy Click'
  | 'Membership Click';

export function trackEvent(eventName: AnalyticsEvent, props: Record<string, string> = {}): void {
  if (typeof window === 'undefined' || typeof window.plausible !== 'function') {
    return;
  }

  const safeProps = Object.fromEntries(
    Object.entries(props)
      .filter(([, value]) => value !== '')
      .map(([key, value]) => [key, String(value)])
  );

  window.plausible(eventName, { props: safeProps });
}
