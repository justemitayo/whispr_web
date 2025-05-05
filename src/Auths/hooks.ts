import { useMutation, UseMutationResult} from "@tanstack/react-query";
import { getOTP, registerUser, verifyOTP } from "./api";
import { GetOTPRequest, GetOTPResponse, VerifyOTPRequest, VerifyOTPResponse, RegisterUserRequest, AuthResponse } from "./types";


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
export const useRegisterUser = (): UseMutationResult<AuthResponse, Error, RegisterUserRequest> => {
  return useMutation<AuthResponse, Error, RegisterUserRequest> ({
    mutationFn: registerUser
  })
}