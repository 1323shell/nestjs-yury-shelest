export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordToken {
  resetPasswordToken: string;
}

export interface SendEmail {
  from: string;
  to: string;
  subject: string;
  html: string;
}
