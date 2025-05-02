export interface GetOTPRequest {
  email: string;
  phone_number: string;
  user_name: string;
}
export interface GetOTPResponse extends ServerResponse<string> {}


