import instance from "../Configs/Api";
import { GetOTPRequest, GetOTPResponse } from "./types";


export async function getOTP(payload: GetOTPRequest): Promise<GetOTPResponse> {
  const response = await instance.post('/auth/get_code', payload);
  return response.data;
}