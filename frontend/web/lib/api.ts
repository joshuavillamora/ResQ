export type BackendReport = {
  id: number;
  user_id: number | null;
  disaster_type: string;
  latitude: number;
  longitude: number;
  barangay: string;
  status: string;
  source: string;
  confidence: number;
  description: string | null;
  severity: string | null;
  image_url: string | null;
  images: string[];
  created_at: string | null;
  updated_at: string | null;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
  auth?: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const ENV_TOKEN = process.env.NEXT_PUBLIC_STAFF_TOKEN;

function getBrowserToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const localToken = window.localStorage.getItem("resq_staff_token");
  if (localToken) {
    return localToken;
  }

  const sessionToken = window.sessionStorage.getItem("resq_staff_token");
  if (sessionToken) {
    return sessionToken;
  }

  return null;
}

function getAuthToken(): string | null {
  return getBrowserToken() ?? ENV_TOKEN ?? null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (options.auth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Staff token missing. Set NEXT_PUBLIC_STAFF_TOKEN or save resq_staff_token in browser storage.");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;

    try {
      const payload = await response.json();
      detail = payload.detail ?? payload.message ?? detail;
    } catch {
      // Keep default error detail when response is not JSON.
    }

    throw new Error(detail);
  }

  return (await response.json()) as T;
}

export async function fetchBackendHealth(): Promise<{ message: string }> {
  return request<{ message: string }>("/");
}

export async function fetchReports(filters?: {
  disasterType?: string;
  status?: string;
  barangay?: string;
  source?: string;
}): Promise<BackendReport[]> {
  const params = new URLSearchParams();

  if (filters?.disasterType) {
    params.set("disaster_type", filters.disasterType);
  }

  if (filters?.status) {
    params.set("status", filters.status);
  }

  if (filters?.barangay) {
    params.set("barangay", filters.barangay);
  }

  if (filters?.source) {
    params.set("source", filters.source);
  }

  const query = params.toString();
  const path = query ? `/reports?${query}` : "/reports";

  return request<BackendReport[]>(path, { auth: true });
}

export function normalizeDisasterLabel(disasterType: string): string {
  return disasterType
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalizeStatusLabel(status: string): string {
  if (status === "unverified") {
    return "Pending";
  }

  if (status === "false_report") {
    return "False Report";
  }

  if (status === "responding") {
    return "In Progress";
  }

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function confidenceLabel(confidence: number): "High" | "Medium" | "Low" {
  if (confidence >= 70) {
    return "High";
  }

  if (confidence >= 40) {
    return "Medium";
  }

  return "Low";
}
