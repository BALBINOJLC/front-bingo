// lib/api.service.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"; // Replace http://localhost:3000/api with actual base URL if available

interface ApiError {
  message: string;
  details?: any;
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: any,
  token?: string,
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      const error: ApiError = {
        message: `API request failed with status ${response.status}: ${errorData.message || response.statusText}`,
        details: errorData,
      };
      console.error("API Error:", error);
      throw error;
    }

    // Handle cases where response might be empty (e.g., 204 No Content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return (await response.json()) as T;
    }
    // If not JSON or empty, resolve with a simple success indication or null
    // Adjust based on how your API handles non-JSON/empty successful responses
    return { success: true } as any; // Or return null, or a specific type
  } catch (error) {
    console.error("Fetch Error:", error);
    // Ensure all thrown errors conform to ApiError or a similar structure
    if (error && typeof error === 'object' && 'message' in error) {
        throw error; // Re-throw if it's already an ApiError or similar
    }
    throw { message: "Network or unexpected error occurred." } as ApiError;
  }
}

// --- Auth Endpoints ---
// Corresponds to "AUTH/SINGUP" in Postman
export const signup = (data: any) => request<any>("POST", "/v1/auth/signup", data); // Replace v1 with actual version

// Corresponds to "AUTH/SIGIN" in Postman
export const signin = (data: any) => request<any>("POST", "/v1/auth/signin", data); // Replace v1 with actual version

// Corresponds to "AUTH/RESET PASSWORD" in Postman
export const resetPassword = (data: any, token: string) => request<any>("POST", `/v1/auth/reset-password?token=${token}`, data);

// Corresponds to "AUTH/CHANGE PASSWORD" in Postman
export const changePassword = (data: any, token: string) => request<any>("POST", "/v1/auth/change-password", data, token);

// Corresponds to "AUTH/CHECK TOKEN" in Postman
export const checkToken = (token: string) => request<any>("GET", "/v1/auth/check", undefined, token);

// Corresponds to "AUTH/PASSWORD SET" in Postman
export const setPassword = (data: any, token: string) => request<any>("POST", "/v1/auth/password/set", data, token);

// Corresponds to "AUTH/ACTIVATE ACCOUNT" in Postman
export const activateAccount = (token: string) => request<any>("GET", `/v1/auth/activateaccount/${token}`);

// Corresponds to "AUTH/LINK PASSWORD" in Postman
export const requestPasswordLink = (data: any) => request<any>("POST", "/v1/auth/link/password", data);


// --- Bingo Endpoints ---
// Corresponds to "BINGO/Crear evento de bingo Copy" in Postman
export const createBingoEvent = (data: any, token: string) => request<any>("POST", "/v1/bingo", data, token);

// Corresponds to "BINGO/Obtener todos los eventos Copy" in Postman
export const getAllBingoEvents = (token: string) => request<any>("GET", "/v1/bingo", undefined, token);

// Corresponds to "BINGO/Obtener evento por ID Copy" in Postman
export const getBingoEventById = (id: string, token: string) => request<any>("GET", `/v1/bingo/${id}`, undefined, token);

// Corresponds to "BINGO/Eliminar evento Copy" in Postman
export const deleteBingoEvent = (id: string, token: string) => request<any>("DELETE", `/v1/bingo/${id}`, undefined, token);

// Corresponds to "BINGO/Comprar ticket Copy" in Postman
export const purchaseTicket = (data: any, token: string) => request<any>("POST", "/v1/bingo/tickets/purchase", data, token);

// Corresponds to "BINGO/Obtener cartones disponibles de un evento Copy" in Postman
export const getAvailableCartons = (eventId: string, token: string) => request<any>("GET", `/v1/bingo/events/${eventId}/cartons/available`, undefined, token);

// Corresponds to "BINGO/Actualizar estado del evento Copy" in Postman
export const updateEventStatus = (id: string, data: any, token: string) => request<any>("PATCH", `/v1/bingo/${id}/status`, data, token);

// --- User Endpoints (from USERS folder in Postman) ---
// Corresponds to "USERS/PROFILE/ADDRESS/ADD AVAILABLE ADDRESS"
export const addUserAddress = (data: any, token: string) => request<any>("POST", "/v1/users/profile/address/add-available-address", data, token);

// Corresponds to "USERS/PROFILE/ADDRESS/REMOVE AVAILABLE ADDRESS"
export const removeUserAddress = (id: string, token: string) => request<any>("DELETE", `/v1/users/profile/address/${id}`, undefined, token);

// Corresponds to "USERS/PROFILE/ATTACHMENTS/ADD ATTACHMENT"
export const addUserAttachment = (data: any, token: string) => request<any>("POST", "/v1/users/profile/attachment/add", data, token);

// Corresponds to "USERS/PROFILE/SCHEDULES/ADD NEW SCHEDULE"
export const addUserSchedule = (data: any, token: string) => request<any>("POST", "/v1/users/profile/schedule", data, token);

// Corresponds to "USERS/PROFILE/SCHEDULES/GET SCHEDULES BY PROFILE ID"
export const getUserSchedules = (idProfile: string, token: string) => request<any>("GET", `/v1/users/profile/schedule/${idProfile}`, undefined, token);

// Corresponds to "USERS/PROFILE/SCHEDULES/UPDATE SCHEDULE ENDODONTIST"
export const updateUserSchedule = (id: string, data: any, token: string) => request<any>("PATCH", `/v1/users/profile/schedule/${id}`, data, token);

// Corresponds to "USERS/PROFILE/SCHEDULES/GET AVAILABLE SLOTS"
// Note: Query parameters should be handled by constructing the endpoint string or passed in `data` if the `request` function is enhanced.
export const getAvailableSlots = (params: string, token: string) => request<any>("GET", `/v1/users/profile/schedule/available-slots?${params}`, undefined, token);

// Corresponds to "USERS/PROFILE/SCHEDULES/GET AVAILABLE ENDODONTIST"
export const getAvailableEndodontists = (params: string, token: string) => request<any>("GET", `/v1/users/profile/schedule/available-endodontists?${params}`, undefined, token);

// Corresponds to "USERS/PROFILE/SCHEDULES/DELETE SCHEDULE"
export const deleteUserSchedule = (id: string, token: string) => request<any>("DELETE", `/v1/users/profile/schedule/${id}`, undefined, token);

// Corresponds to "USERS/PROFILE/TREATMENTS/CREATE OR UPDATE TYPE TREATMENT"
export const createOrUpdateUserTreatment = (data: any, token: string) => request<any>("PATCH", "/v1/users/profile/treatment/create-or-update", data, token);

// Corresponds to "USERS/PROFILE/TREATMENTS/CREATE OR UPDATE STYLE TREATMENT"
export const createOrUpdateUserStyleTreatment = (data: any, token: string) => request<any>("PATCH", "/v1/users/profile/treatment/add-or-update-style-treatment", data, token);

// Corresponds to "USERS/USERS DELETE ALL"
export const deleteAllUsers = (token: string) => request<any>("DELETE", "/v1/users/all/from-owner", undefined, token);

// Corresponds to "USERS/FIND ALL"
export const findAllUsers = (limit: number, offset: number, token: string) => request<any>("GET", `/v1/users/${limit}/${offset}`, undefined, token);

// Corresponds to "USERS/USER FIND ONE"
// Example: paramsString = "id=someId&email=someEmail"
export const findOneUser = (paramsString: string, token: string) => request<any>("GET", `/v1/users?${paramsString}`, undefined, token);

// Corresponds to "USERS/DELETE_USER_FILES" - Endpoint seems to be /treatments/:id, ensure this is correct
export const deleteUserFiles = (id: string, token: string) => request<any>("DELETE", `/v1/treatments/${id}`, undefined, token); // Verify endpoint

// Corresponds to "USERS/UPDATE USER"
export const updateUser = (id: string, data: any, token: string) => request<any>("PATCH", `/v1/users/user/update/${id}`, data, token);

// Corresponds to "USERS/CREATE"
export const createUser = (data: any, token: string) => request<any>("POST", "/v1/users/create", data, token);

// Note: Replace http://localhost:3000/api and v1 with actual values.
// The http://localhost:3000/api variable is typically the base URL of your backend.
// The v1 variable is typically the API version (e.g., "v1").
// These might be environment variables or constants.
// For example, if your API base URL is "https://api.example.com" and version is "v1",
// the signup endpoint would be "https://api.example.com/v1/auth/signup".
// Ensure these are correctly configured in your environment.
