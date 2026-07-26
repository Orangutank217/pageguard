export const PLANS = {
  free: {
    maxMonitors: 1,
    minIntervalMinutes: 5,
    maxStatusPages: 1,
    maxChecksPerMonitor: 50,
    branding: true,
    customDomain: false,
  },
  pro: {
    maxMonitors: Infinity,
    minIntervalMinutes: 1,
    maxStatusPages: Infinity,
    maxChecksPerMonitor: 1000,
    branding: false,
    customDomain: true,
  },
} as const;

export type PlanTier = keyof typeof PLANS;

export function getPlanLimits(plan: string) {
  return PLANS[plan as PlanTier] ?? PLANS.free;
}

export function enforceInterval(plan: string, interval: number): number {
  const limits = getPlanLimits(plan);
  return Math.max(interval, limits.minIntervalMinutes);
}
