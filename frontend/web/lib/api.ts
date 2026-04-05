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

export type BackendUser = {
  id: number;
  name: string;
  phone_number: string;
  role: string;
  created_at: string | null;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: BackendUser;
};

export type BackendResponder = BackendUser & {
  verification_count: number;
  report_count: number;
};

// MOCK DATA CENTERED ON ILOILO CITY (10.7202° N, 122.5625° E)
const MOCK_REPORTS: BackendReport[] = [
  {
    id: 1,
    user_id: 1,
    disaster_type: "fire",
    latitude: 10.6888,
    longitude: 122.5275,
    barangay: "Arevalo",
    status: "responding",
    source: "wifi",
    confidence: 92,
    description: "Commercial building fire near Arevalo Market",
    severity: "high",
    image_url: "https://via.placeholder.com/400x300?text=Fire+Arevalo",
    images: [],
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    user_id: 2,
    disaster_type: "flood",
    latitude: 10.7321,
    longitude: 122.5578,
    barangay: "Jaro",
    status: "verified",
    source: "wifi",
    confidence: 85,
    description: "Flash flooding in Jaro district after heavy rainfall",
    severity: "medium",
    image_url: "https://via.placeholder.com/400x300?text=Flood+Jaro",
    images: [],
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    user_id: null,
    disaster_type: "landslide",
    latitude: 10.7008,
    longitude: 122.5456,
    barangay: "Molo",
    status: "unverified",
    source: "sms",
    confidence: 68,
    description: "Multiple casualties reported near Molo district",
    severity: "high",
    image_url: null,
    images: [],
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: 4,
    user_id: 3,
    disaster_type: "typhoon",
    latitude: 10.7149,
    longitude: 122.5796,
    barangay: "La Paz",
    status: "resolved",
    source: "wifi",
    confidence: 98,
    description: "Strong winds and heavy rain affecting La Paz area",
    severity: "high",
    image_url: "https://via.placeholder.com/400x300?text=Typhoon+LaPaz",
    images: [],
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    user_id: null,
    disaster_type: "earthquake",
    latitude: 10.7079,
    longitude: 122.5668,
    barangay: "Mansisidor",
    status: "responding",
    source: "sms",
    confidence: 78,
    description: "Moderate ground shaking reported near city center",
    severity: "medium",
    image_url: null,
    images: [],
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    user_id: 4,
    disaster_type: "landslide",
    latitude: 10.6927,
    longitude: 122.5568,
    barangay: "Singcang-Cabatangan",
    status: "unverified",
    source: "wifi",
    confidence: 55,
    description: "Slope movement and minor soil collapse reported after prolonged rain",
    severity: "medium",
    image_url: null,
    images: [],
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: 7,
    user_id: 1,
    disaster_type: "earthquake",
    latitude: 10.7038,
    longitude: 122.5615,
    barangay: "Caluya",
    status: "verified",
    source: "wifi",
    confidence: 88,
    description: "Aftershock damage reported in Caluya",
    severity: "high",
    image_url: "https://via.placeholder.com/400x300?text=Collapse+Caluya",
    images: [],
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    user_id: 2,
    disaster_type: "landslide",
    latitude: 10.7072,
    longitude: 122.5728,
    barangay: "Flores",
    status: "unverified",
    source: "sms",
    confidence: 72,
    description: "Mass casualty alert from Flores health outpost",
    severity: "high",
    image_url: null,
    images: [],
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: 9,
    user_id: null,
    disaster_type: "fire",
    latitude: 10.7087,
    longitude: 122.5561,
    barangay: "San Miguel",
    status: "resolved",
    source: "wifi",
    confidence: 94,
    description: "House fire in San Miguel residential area",
    severity: "medium",
    image_url: "https://via.placeholder.com/400x300?text=Fire+SanMiguel",
    images: [],
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    user_id: 5,
    disaster_type: "flood",
    latitude: 10.6995,
    longitude: 122.5824,
    barangay: "Tanza",
    status: "verified",
    source: "sms",
    confidence: 81,
    description: "Waterlogging in low-lying areas of Tanza",
    severity: "low",
    image_url: "https://via.placeholder.com/400x300?text=Flood+Tanza",
    images: [],
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 11,
    user_id: null,
    disaster_type: "volcano",
    latitude: 10.7241,
    longitude: 122.5408,
    barangay: "Buhang",
    status: "unverified",
    source: "sms",
    confidence: 74,
    description: "Ash plume and elevated heat reported near the volcano monitoring zone",
    severity: "high",
    image_url: null,
    images: [],
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updated_at: null,
  },
];

const MOCK_RESPONDERS: BackendResponder[] = [
  {
    id: 1,
    name: "John Dela Cruz",
    phone_number: "+639161234567",
    role: "responder",
    created_at: "2024-01-10T08:00:00Z",
    verification_count: 45,
    report_count: 62,
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    phone_number: "+639179876543",
    role: "responder",
    created_at: "2024-01-05T10:30:00Z",
    verification_count: 38,
    report_count: 51,
  },
  {
    id: 3,
    name: "Pedro Gonzales",
    phone_number: "+639175555555",
    role: "responder",
    created_at: "2024-01-08T14:15:00Z",
    verification_count: 52,
    report_count: 68,
  },
  {
    id: 4,
    name: "Anna Reyes",
    phone_number: "+639164444444",
    role: "responder",
    created_at: "2023-12-20T09:00:00Z",
    verification_count: 41,
    report_count: 57,
  },
  {
    id: 5,
    name: "Carlos Santos",
    phone_number: "+639183333333",
    role: "responder",
    created_at: "2024-01-12T11:45:00Z",
    verification_count: 28,
    report_count: 39,
  },
  {
    id: 6,
    name: "Isabel Mercado",
    phone_number: "+639172222222",
    role: "coordinator",
    created_at: "2023-11-30T08:30:00Z",
    verification_count: 89,
    report_count: 156,
  },
];

const MOCK_CURRENT_USER: BackendUser = {
  id: 100,
  name: "Admin Staff",
  phone_number: "+639191111111",
  role: "admin",
  created_at: "2023-01-01T00:00:00Z",
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
  auth?: boolean;
};

// Using mock data by default (no actual API calls)
const API_BASE_URL = "mock://iloilo-resq";
const ENV_TOKEN = process.env.NEXT_PUBLIC_STAFF_TOKEN;
const TOKEN_STORAGE_KEY = "resq_staff_token";
const USER_STORAGE_KEY = "resq_staff_user";

function getBrowserToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const localToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (localToken) {
    return localToken;
  }

  const sessionToken = window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (sessionToken) {
    return sessionToken;
  }

  return null;
}

function getAuthToken(): string | null {
  return getBrowserToken() ?? ENV_TOKEN ?? "mock_default_token";
}

export function getStoredUser(): BackendUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = window.localStorage.getItem(USER_STORAGE_KEY) ?? window.sessionStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as BackendUser;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: BackendUser, persist: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  const storage = persist ? window.localStorage : window.sessionStorage;
  const alternateStorage = persist ? window.sessionStorage : window.localStorage;

  storage.setItem(TOKEN_STORAGE_KEY, token);
  storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

  alternateStorage.removeItem(TOKEN_STORAGE_KEY);
  alternateStorage.removeItem(USER_STORAGE_KEY);
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
  window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  window.sessionStorage.removeItem(USER_STORAGE_KEY);
}

// Simulate network delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchBackendHealth(): Promise<{ message: string }> {
  await delay(150);
  return { message: "ResQ Iloilo City backend is healthy" };
}

export async function fetchReports(filters?: {
  disasterType?: string;
  status?: string;
  barangay?: string;
  source?: string;
}): Promise<BackendReport[]> {
  await delay(250);

  let results = [...MOCK_REPORTS];

  if (filters?.disasterType) {
    results = results.filter((r) => r.disaster_type === filters.disasterType);
  }

  if (filters?.status) {
    results = results.filter((r) => r.status === filters.status);
  }

  if (filters?.barangay) {
    results = results.filter((r) => r.barangay === filters.barangay);
  }

  if (filters?.source) {
    results = results.filter((r) => r.source === filters.source);
  }

  return results;
}

export async function loginStaff(phoneNumber: string, password: string): Promise<LoginResponse> {
  if (!phoneNumber || !password) {
    throw new Error("Phone number and password are required");
  }

  await delay(300);

  return {
    message: "Staff login successful",
    token: `mock_staff_token_${phoneNumber}_${Date.now()}`,
    user: {
      id: 100,
      name: "Admin Staff",
      phone_number: phoneNumber,
      role: "admin",
      created_at: new Date().toISOString(),
    },
  };
}

export async function fetchCurrentUser(): Promise<BackendUser> {
  await delay(200);
  return MOCK_CURRENT_USER;
}

export async function fetchResponders(): Promise<BackendResponder[]> {
  await delay(250);
  return MOCK_RESPONDERS;
}

export function normalizeDisasterLabel(disasterType: string): string {
  return disasterType
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalizeStatusLabel(status: string): string {
  if (status === "unverified") {
    return "Pending";
  }

  if (status === "responding") {
    return "In Progress";
  }

  if (status === "false_report") {
    return "False Report";
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
