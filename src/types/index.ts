export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface sendEmail {
  from: string;
  to: string;
  subject: string;
  html: string;
}
