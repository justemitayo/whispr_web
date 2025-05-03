import instance from "../Configs/Api";
import { GetOTPRequest, GetOTPResponse, VerifyOTPRequest, VerifyOTPResponse} from "./types";


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