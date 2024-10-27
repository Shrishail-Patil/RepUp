// utils/validation.ts
export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const validatePassword = (password: string) => {
    return {
      isValid: password.length >= 8,
      message: password.length < 8 ? 'Password must be at least 8 characters' : ''
    }
  }
  
  export const validateFullName = (name: string) => {
    return {
      isValid: name.length >= 2,
      message: name.length < 2 ? 'Name must be at least 2 characters' : ''
    }
  }