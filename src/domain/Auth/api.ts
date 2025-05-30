import instance from "../../Configs/Api";
import { GetOTPRequest, GetOTPResponse, VerifyOTPRequest, VerifyOTPResponse, RegisterUserRequest, AuthResponse, LoginUserRequest} from "./types";

export async function loginUser(
  payload: LoginUserRequest,
): Promise<AuthResponse> {
  const response = await instance.post('/auth/login', payload);
  return response.data;
}

export async function getOTP(payload: GetOTPRequest): Promise<GetOTPResponse> {
  const response = await instance.post('/auth/get_code', payload);
  return response.data;
}

export async function verifyOTP(
  payload: VerifyOTPRequest,
): Promise<VerifyOTPResponse> {
  const response = await instance.post('/auth/verify_code', payload);
  return response.data;
}


// FormData lets you build a data payload as if you were submitting an HTML form.
// Use .append(key, value) to add fields.
export async function registerUser(
  payload: RegisterUserRequest,
): Promise<AuthResponse> {
  const data = new FormData();
  data.append('user_name', payload.user_name);
  data.append('full_name', payload.full_name);
  data.append('bio', payload.bio);
  data.append('phone_number', payload.phone_number);
  data.append('email', payload.email);
  data.append('password', payload.password);
  if (payload.profile_picture) {
    data.append('profile_picture', payload.profile_picture); 
  }

  const response = await instance.post('/auth/register', data);
  return response.data
}