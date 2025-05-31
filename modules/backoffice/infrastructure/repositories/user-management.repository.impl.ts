// modules/backoffice/infrastructure/repositories/user-management.repository.impl.ts
import type {
  UserManagementRepository,
  UserFilters, // Assuming this will be used to construct query params
  UserSortOptions, // Assuming this will be used to construct query params
  UserDetails, // Domain entity, ensure it matches API response for user details
} from "../../domain/entities/user-management.entity";
import { type BackofficeUser, UserRole } from "../../domain/entities/user-role.entity"; // Domain entity for user lists
import * as ApiService from "@/lib/api.service"; // Adjust path as needed

export class UserManagementRepositoryImpl implements UserManagementRepository {

  // Corresponds to "USERS/FIND ALL"
  async getUsers(
    page: number, // Postman endpoint is /:limit/:offset, not page/limit
    limit: number,
    filters?: UserFilters, // Needs mapping to query parameters if API supports filtering
    sort?: UserSortOptions, // Needs mapping to query parameters if API supports sorting
    token?: string, // Added token
  ): Promise<{ users: BackofficeUser[]; total: number }> {
    // The Postman endpoint is {{API}}/{{VER}}/users/:limit/:offset
    // It does not show support for query params for filters or sort in its definition.
    // If filtering/sorting is needed, the API must support it via query params,
    // and these params would need to be constructed and appended to the path.
    let path = `/users/${limit}/${(page - 1) * limit}`; // Basic conversion from page/limit to limit/offset

    // Example: If filters and sort were supported via query params
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.role) queryParams.append("role", filters.role);
      if (filters.isActive !== undefined) queryParams.append("isActive", String(filters.isActive));
      if (filters.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
    }
    if (sort) {
      queryParams.append("sortBy", sort.field);
      queryParams.append("sortDirection", sort.direction);
    }
    if (queryParams.toString()) {
      path += `?${queryParams.toString()}`;
    }

    // For now, using the basic path as per Postman definition, assuming no server-side filter/sort from this endpoint.
    // The findAllUsers in ApiService takes limit and offset.
    const response = await ApiService.findAllUsers(limit, (page - 1) * limit, token || ""); // Pass token
    // TODO: Map response to { users: BackofficeUser[]; total: number }
    // Postman "FIND ALL" has no response example. Assume it returns an array of users and possibly total count.
    // If total is not returned, it might need a separate count endpoint or client-side calculation if all users are fetched.
    return {
        users: response.users as BackofficeUser[], // Casting, ensure mapping
        total: response.total || response.users.length, // Assuming total might be part of response
    };
  }

  // Corresponds to "USERS/USER FIND ONE"
  async getUserDetails(userId: string, token?: string): Promise<UserDetails | null> { // Added token
    // Postman endpoint is {{API}}/{{VER}}/users?id={{USER_ID_GUX}} or ?email=...
    try {
      const response = await ApiService.findOneUser(`id=${userId}`, token || ""); // Pass token
      // TODO: Map response to UserDetails
      // No response example. Assume it returns the detailed user object.
      return response as UserDetails; // Casting, ensure mapping
    } catch (error: any) {
      if (error && error.details && error.details.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  // Corresponds to "USERS/UPDATE USER" for status
  async updateUserStatus(userId: string, isActive: boolean, token?: string): Promise<boolean> { // Added token
    // Postman endpoint {{API}}/{{VER}}/users/user/update/:id
    // Body: { "status": "AUTHORIZED", "is_active": true, "email_verify": true }
    // We only want to update isActive here. The API might need other fields or a specific "status" field.
    // Assuming the API can partially update with just "is_active".
    try {
      await ApiService.updateUser(userId, { is_active: isActive }, token || ""); // Pass token
      return true;
    } catch {
      return false;
    }
  }

  // Corresponds to "USERS/UPDATE USER" for role
  async updateUserRole(userId: string, role: UserRole, token?: string): Promise<boolean> { // Added token
    // Similar to updateUserStatus, using the general "USERS/UPDATE USER" endpoint.
    // The API needs to support updating the 'role' field.
    try {
      await ApiService.updateUser(userId, { role: role }, token || ""); // Pass token
      return true;
    } catch {
      return false;
    }
  }

  // addUserNote doesn't have a direct Postman endpoint in the collection.
  // It might be part of a general user update or a specific notes endpoint.
  async addUserNote(userId: string, note: string, token?: string): Promise<boolean> { // Added token
    console.warn("addUserNote not mapped to a specific Postman endpoint. This might require a user profile update endpoint with a notes field.");
    // Example if using general update:
    // await ApiService.updateUser(userId, { notes: note }, token || "");
    // return true;
    return false; // Placeholder
  }

  // --- Methods from Postman USERS folder ---
  // These methods were added to api.service.ts and should be implemented here if they are part of this repository's responsibilities.

  // Corresponds to "USERS/PROFILE/ADDRESS/ADD AVAILABLE ADDRESS"
  async addUserAddress(data: any, token: string): Promise<any> {
    const response = await ApiService.addUserAddress(data, token);
    // TODO: Define and map response type
    return response;
  }

  // Corresponds to "USERS/PROFILE/ADDRESS/REMOVE AVAILABLE ADDRESS"
  async removeUserAddress(id: string, token: string): Promise<void> {
    await ApiService.removeUserAddress(id, token);
  }

  // Corresponds to "USERS/PROFILE/ATTACHMENTS/ADD ATTACHMENT"
  async addUserAttachment(data: any, token: string): Promise<any> {
    const response = await ApiService.addUserAttachment(data, token);
    // TODO: Define and map response type
    return response;
  }

  // Corresponds to "USERS/PROFILE/SCHEDULES/ADD NEW SCHEDULE"
  async addUserSchedule(data: any, token: string): Promise<any> {
    const response = await ApiService.addUserSchedule(data, token);
    // TODO: Define and map response type
    return response;
  }

  // Corresponds to "USERS/PROFILE/SCHEDULES/GET SCHEDULES BY PROFILE ID"
  async getUserSchedules(idProfile: string, token: string): Promise<any[]> {
    const response = await ApiService.getUserSchedules(idProfile, token);
    // TODO: Define and map response type (e.g., Schedule[])
    return response as any[];
  }

  // Corresponds to "USERS/PROFILE/SCHEDULES/UPDATE SCHEDULE ENDODONTIST"
  async updateUserSchedule(id: string, data: any, token: string): Promise<any> {
    const response = await ApiService.updateUserSchedule(id, data, token);
    // TODO: Define and map response type
    return response;
  }

  // Corresponds to "USERS/PROFILE/SCHEDULES/GET AVAILABLE SLOTS"
  async getAvailableSlots(params: string, token: string): Promise<any[]> {
    const response = await ApiService.getAvailableSlots(params, token);
    // TODO: Define and map response type (e.g., Slot[])
    return response as any[];
  }

  // Corresponds to "USERS/PROFILE/SCHEDULES/GET AVAILABLE ENDODONTIST"
  async getAvailableEndodontists(params: string, token: string): Promise<any[]> {
    const response = await ApiService.getAvailableEndodontists(params, token);
    // TODO: Define and map response type (e.g., Endodontist[])
    return response as any[];
  }

  // Corresponds to "USERS/PROFILE/SCHEDULES/DELETE SCHEDULE"
  async deleteUserSchedule(id: string, token: string): Promise<void> {
    await ApiService.deleteUserSchedule(id, token);
  }

  // Corresponds to "USERS/PROFILE/TREATMENTS/CREATE OR UPDATE TYPE TREATMENT"
  async createOrUpdateUserTreatment(data: any, token: string): Promise<any> {
    const response = await ApiService.createOrUpdateUserTreatment(data, token);
    // TODO: Define and map response type
    return response;
  }

  // Corresponds to "USERS/PROFILE/TREATMENTS/CREATE OR UPDATE STYLE TREATMENT"
  async createOrUpdateUserStyleTreatment(data: any, token: string): Promise<any> {
    const response = await ApiService.createOrUpdateUserStyleTreatment(data, token);
    // TODO: Define and map response type
    return response;
  }

  // Corresponds to "USERS/USERS DELETE ALL"
  async deleteAllUsers(token: string): Promise<void> {
    await ApiService.deleteAllUsers(token);
  }

  // Corresponds to "USERS/DELETE_USER_FILES" - Note: Postman endpoint is /treatments/:id
  // This seems misplaced if it's for "user files" but endpoint is "treatments". Clarify purpose.
  // Assuming it's `deleteTreatment` rather than generic user files.
  async deleteUserFiles(treatmentId: string, token: string): Promise<void> {
    console.warn("deleteUserFiles is calling ApiService.deleteUserFiles which targets /treatments/:id. Ensure this is the intended behavior for 'user files'.");
    await ApiService.deleteUserFiles(treatmentId, token);
  }

  // Corresponds to "USERS/UPDATE USER" - Generic update
  async updateUser(userId: string, data: Partial<UserDetails | BackofficeUser>, token: string): Promise<UserDetails> {
    const response = await ApiService.updateUser(userId, data, token);
    // TODO: Define and map response type (e.g., UserDetails)
    return response as UserDetails;
  }

  // Corresponds to "USERS/CREATE"
  async createUser(data: any, token: string): Promise<BackofficeUser> { // Assuming it returns a BackofficeUser
    const response = await ApiService.createUser(data, token);
    // TODO: Define and map response type
    // Postman request body: { "email": "...", "password": "...", "first_name": "...", ... "role": "ADMIN" }
    // Response example is for SIGIN, so actual create user response structure is needed.
    return response as BackofficeUser;
  }
}
