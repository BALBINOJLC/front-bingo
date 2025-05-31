import type { AuthRepository } from "../../domain/repositories/auth.repository"
import { Email } from "../../domain/value-objects/email.vo"
import { Password } from "../../domain/value-objects/password.vo"
import type { RegisterDto } from "../dtos/auth.dto"

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(dto: RegisterDto) {
    // Validate passwords match
    if (dto.password !== dto.confirmPassword) {
      throw new Error("Passwords do not match")
    }

    // Validate input
    const email = Email.create(dto.email)
    const password = Password.create(dto.password)

    // Execute registration
    return await this.authRepository.register(dto.name.trim(), email.getValue(), password.getValue())
  }
}
