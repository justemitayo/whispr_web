import { useMutation, UseMutationResult} from "@tanstack/react-query";
import { getOTP, registerUser, verifyOTP, loginUser } from "./api";
import { GetOTPRequest, GetOTPResponse, VerifyOTPRequest, VerifyOTPResponse, RegisterUserRequest, AuthResponse, LoginUserRequest } from "./types";


export const useGetOTP = (): UseMutationResult<GetOTPResponse, Error, GetOTPRequest> => {
  return useMutation<GetOTPResponse, Error, GetOTPRequest>({
    mutationFn: getOTP,
  });
};
export const useLoginUser = (): UseMutationResult<AuthResponse, Error, LoginUserRequest> => {
  return useMutation<AuthResponse, Error, LoginUserRequest>({
    mutationFn: loginUser,
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
