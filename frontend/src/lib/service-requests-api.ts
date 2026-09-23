// Admin API client for /api/service-requests.
// Reuses the admin token stored by services-api.
import { adminFetch, getAdminToken } from "./services-api";

export type ServiceRequestStatus = "pending" | "paid" | "in_review" | "delivered" | "cancelled";

export type ServiceRequestDTO = {
  id: number;
  userId: number | null;
  serviceSlug: string;
  serviceTitle: string;
  name: string;
  email: string;
  phone: string | null;
  targetRole: string | null;
  notes: string | null;
  fileUrl: string | null;
  amount: number;
  currency: string;
  status: ServiceRequestStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  adminNote: string | null;
  deliveryFileUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

function authHeaders(): HeadersInit {
  const t = getAdminToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function listServiceRequests(): Promise<ServiceRequestDTO[]> {
  const r = await adminFetch(
    "/api/service-requests/admin",
    {
      headers: authHeaders(),
    },
    "Failed to load service requests",
  );
  return (await r.json()).items || [];
}

export async function updateServiceRequest(
  id: number,
  data: {
    status?: ServiceRequestStatus;
    adminNote?: string;
    deliveryFileUrl?: string;
    deliveryFile?: File | null;
  },
): Promise<ServiceRequestDTO> {
  const fd = new FormData();
  if (data.status) fd.append("status", data.status);
  if (data.adminNote !== undefined) fd.append("adminNote", data.adminNote);
  if (data.deliveryFileUrl) fd.append("deliveryFileUrl", data.deliveryFileUrl);
  if (data.deliveryFile) fd.append("deliveryFile", data.deliveryFile);
  const r = await adminFetch(
    `/api/service-requests/admin/${id}`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: fd,
    },
    "Update failed",
  );
  return (await r.json()).item;
}
