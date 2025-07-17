import { useQuery, UseQueryResult } from "@tanstack/react-query";
import usersService from "services/users";
import { UserResponse } from "services/users/interface";

export const useGetUsers = (params?: {
  limit?: number;
  skip?: number;
  order?: string;
  search?: string;
}): UseQueryResult<UserResponse> => {
  return useQuery({
    queryFn: async (): Promise<UserResponse> => {
      return await usersService.getUsers(params);
    },
    queryKey: ["users", params],
  });
};
