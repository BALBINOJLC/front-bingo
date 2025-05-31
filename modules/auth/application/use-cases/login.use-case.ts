import type { AuthRepository } from "../../domain/repositories/auth.repository"
import type { LoginDto } from "../dtos/auth.dto"

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(dto: LoginDto) {
    console.log("LoginUseCase executing with:", dto) // Debug log

    // Basic validation
    if (!dto.email || !dto.password) {
      throw new Error("Email y contraseña son requeridos")
    }

    // Execute login - for demo, any password works
    try {
      const result = await this.authRepository.login(dto.email, dto.password)
      console.log("LoginUseCase success:", result) // Debug log
      return result
    } catch (error) {
      console.error("LoginUseCase error:", error) // Debug log
      throw error
    }
  }
}
