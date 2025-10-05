export class ValidationUtils {
  static validateRequiredFields(data: Record<string, any>, fields: string[]) {
    for (const field of fields) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }
  }

  static validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }
}
