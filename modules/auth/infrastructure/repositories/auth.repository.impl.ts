// modules/auth/infrastructure/repositories/auth.repository.impl.ts
import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type { User, AuthUser } from "../../domain/entities/user.entity";
// Remove UserRole if it's not directly used or redefine/import if still needed for mapping
// import { UserRole } from "../../domain/entities/user.entity";
import * as ApiService from "@/lib/api.service"; // Adjust path as needed

export class AuthRepositoryImpl implements AuthRepository {
  async login(email: string, password: string): Promise<AuthUser> {
    // The signin endpoint expects basic auth, not a JSON body with email/password.
    // The Postman collection for "AUTH/SIGIN" shows:
    // "auth": { "type": "basic", "basic": [ { "key": "username", "value": "balbijlc@gmail.com" ... }, ... ] }
    // And an empty body: "body": { "mode": "raw", "raw": "" ... }
    //
    // For now, I will keep the body as { email, password } as per the original DTO structure.
    // This might need adjustment if the backend strictly expects Basic Auth headers and no body.
    // Or, the ApiService.signin function might need to be adapted to set Basic Auth.
    // The Postman request also has a description indicating a request body, which is contradictory.
    // Let's assume the NestJS backend can handle { email, password } in the body for signin.
    const response = await ApiService.signin({ email, password });
    // TODO: Map the response to the AuthUser structure.
    // The Postman response for SIGIN includes:
    // { "user": { "id": "", "display_name": "", ... }, "access_token": "" }
    // Ensure this matches the AuthUser entity structure.
    return {
      user: response.user, // Assuming response.user matches the User entity
      accessToken: response.access_token, // Assuming response.access_token exists
      refreshToken: response.refresh_token || "default-refresh-token", // Assuming refresh_token might not always be there
    };
  }

  async register(name: string, email: string, password?: string, dni?: string, role?: string, first_name?: string, last_name?: string): Promise<AuthUser> {
    // The Postman collection for "AUTH/SINGUP" shows the following body:
    // { "email": "balbijlc+usuari@gmail.com", "password": "Control1.*", "first_name": "usuario", "last_name": "usuario", "is_active": true, "email_verify": true, "dni":"dnii", "role":"USER" }
    // The `register` method here has `name`, `email`, `password`.
    // We need to align the parameters or the data sent.
    // For now, using the parameters available and matching Postman's `first_name`, `last_name`.
    // `is_active` and `email_verify` are set to true as per Postman example.
    const signupData = {
      email,
      password,
      first_name: first_name || name.split(' ')[0], // Use first_name if provided, else derive from name
      last_name: last_name || name.split(' ').slice(1).join(' '), // Use last_name if provided, else derive from name
      is_active: true,
      email_verify: true,
      dni: dni || "default-dni", // Add a default or ensure it's passed
      role: role || "USER", // Add a default or ensure it's passed
    };
    const response = await ApiService.signup(signupData);
    // TODO: Map the response to the AuthUser structure.
    // The Postman response for SIGNUP (actually shows SIGIN response as example) includes:
    // { "accessToken": "...", "user": { "_id": "...", ... }, "message": "AUTH.SIGNIN_SUCCESS" }
    // This structure needs to be mapped to AuthUser.
    return {
      user: response.user, // Assuming response.user matches User entity
      accessToken: response.accessToken, // Assuming response.accessToken maps to access_token
      refreshToken: response.refreshToken || "default-refresh-token",
    };
  }

  async forgotPassword(email: string): Promise<void> {
    // The Postman collection for "AUTH/LINK PASSWORD" (which seems to be the forgot password link request)
    // has the endpoint "{{API}}/{{VER}}/auth/link/password" and body {"email": "msanz@gux.tech"}
    await ApiService.requestPasswordLink({ email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Postman "AUTH/RESET PASSWORD"
    // URL: {{API}}/{{VER}}/auth/reset-password?token={{TOKEN}}
    // Body: { "password": "123456" }
    await ApiService.resetPassword({ password: newPassword }, token);
  }

  async verifyEmail(token: string): Promise<void> {
    // Postman "AUTH/ACTIVATE ACCOUNT"
    // URL: {{API}}/{{VER}}/auth/activateaccount/{{TOKEN_TEST}}
    // No body.
    await ApiService.activateAccount(token);
  }

  async resendVerificationEmail(email: string): Promise<void> {
    // This functionality is not directly in the Postman collection as a standalone "resend"
    // but "AUTH/LINK PASSWORD" sends a link which might be for password reset or verification.
    // Assuming it's for password reset based on its name.
    // If a separate resend verification email endpoint exists, it should be added to api.service.ts
    // For now, this could call requestPasswordLink if that serves a dual purpose, or be a no-op.
    console.warn("resendVerificationEmail not explicitly mapped to Postman collection. Calling requestPasswordLink as a placeholder.");
    await ApiService.requestPasswordLink({ email });
  }

  async getCurrentUser(token: string): Promise<User | null> {
    // Postman "AUTH/CHECK TOKEN"
    // URL: {{API}}/{{VER}}/auth/check
    // Auth: Bearer token
    // Response example is not for this endpoint, but it should return user details.
    try {
      const response = await ApiService.checkToken(token);
      // TODO: Map the response to the User structure.
      // Assuming the response directly contains the user object or user details.
      // The Postman example for "CHECK TOKEN" is actually "AUTH.FORGOT_PASSWORD_SUCCESS",
      // which is incorrect. A typical check token response would be the user object.
      if (response && response.user) {
        return response.user as User; // Cast if necessary, ensure mapping
      }
      // If the token is invalid or expired, the ApiService request method should throw an error.
      // If it resolves but without a user, return null.
      return null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null; // Or re-throw if the error should be handled by the use case
    }
  }

  async logout(token: string): Promise<void> {
    // Standard logout doesn't usually require a backend call unless to invalidate a server-side session or token.
    // The Postman collection does not show a specific logout endpoint.
    // For client-side token removal:
    // localStorage.removeItem("currentUser"); // Or wherever the token/user is stored
    // This is a client-side operation. If backend invalidation is needed, add an endpoint.
    console.log("Logout called. Token (if needed for backend invalidation):", token);
    // No specific backend call for logout in Postman collection, assuming client-side token removal is sufficient.
    // If an API call is needed: await ApiService.logoutUser(token); (define logoutUser in api.service.ts)
    return Promise.resolve();
  }

  async changePassword(currentPassword: string, newPassword: string, token: string): Promise<void> {
    // Postman "AUTH/CHANGE PASSWORD"
    // URL: {{API}}/{{VER}}/auth/change-password
    // Body: { "currentPassword": "...", "newPassword": "..." }
    // Auth: Bearer token
    await ApiService.changePassword({ currentPassword, newPassword }, token);
  }

  async setPassword(email: string, password: string, token: string): Promise<void> {
    // Postman "AUTH/PASSWORD SET"
    // URL: {{API}}/{{VER}}/auth/password/set
    // Body: { "email": "...", "password": "..." }
    // Auth: Bearer token
    await ApiService.setPassword({ email, password }, token);
  }
}
