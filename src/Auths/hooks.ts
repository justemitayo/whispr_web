import { useMutation, UseMutationResult} from "@tanstack/react-query";
import { getOTP, verifyOTP } from "./api";
import { GetOTPRequest, GetOTPResponse, VerifyOTPRequest, VerifyOTPResponse } from "./types";


export const useGetOTP = (): UseMutationResult<GetOTPResponse, Error, GetOTPRequest> => {
  return useMutation<GetOTPResponse, Error, GetOTPRequest>({
    mutationFn: getOTP,
  });
};

export const useVerifyOTP = (): UseMutationResult<VerifyOTPResponse, Error, VerifyOTPRequest> => {
  return useMutation<VerifyOTPResponse, Error, VerifyOTPRequest>({
    mutationFn: verifyOTP
  })
}