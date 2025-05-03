export interface GetOTPRequest {
  email: string;
  phone_number: string;
  user_name: string;
}
export interface GetOTPResponse extends ServerResponse<string> {}

export interface VerifyOTPRequest {
  email: string;
  token: string;
}
export interface VerifyOTPResponse extends ServerResponse<boolean> {}


