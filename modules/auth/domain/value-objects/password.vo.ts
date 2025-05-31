export class Password {
  private constructor(private readonly value: string) {}

  static create(password: string): Password {
    if (!this.isValid(password)) {
      throw new Error(
        "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character",
      )
    }
    return new Password(password)
  }

  static isValid(password: string): boolean {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  }

  getValue(): string {
    return this.value
  }
}
