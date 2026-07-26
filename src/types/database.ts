// Hand-types from schema — replace with `supabase gen types` when linked
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: "free" | "pro";
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Monitor {
  id: string;
  user_id: string;
  name: string;
  url: string;
  interval_minutes: number;
  is_active: boolean;
  alert_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Check {
  id: string;
  monitor_id: string;
  status_code: number | null;
  response_time_ms: number | null;
  is_up: boolean;
  error_message: string | null;
  checked_at: string;
}

export interface Incident {
  id: string;
  monitor_id: string;
  started_at: string;
  resolved_at: string | null;
  duration_seconds: number | null;
  reason: string | null;
}

export interface StatusPage {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  description: string | null;
  is_public: boolean;
  custom_domain: string | null;
  created_at: string;
}

export interface StatusPageMonitor {
  id: string;
  status_page_id: string;
  monitor_id: string;
}

// Extended type for dashboard display
export interface MonitorWithLatest extends Monitor {
  latest_check: Check | null;
  uptime_percent_30d: number | null;
  recent_checks: Pick<Check, "response_time_ms" | "checked_at">[];
}
