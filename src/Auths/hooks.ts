import { useMutation, UseMutationResult} from "@tanstack/react-query";
import { getOTP } from "./api";
import { GetOTPRequest, GetOTPResponse } from "./types";


export const useGetOTP = (): UseMutationResult<GetOTPResponse, Error, GetOTPRequest> => {
  return useMutation<GetOTPResponse, Error, GetOTPRequest>({
    mutationFn: getOTP,
  });
};