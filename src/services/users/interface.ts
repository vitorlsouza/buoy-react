export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface UserResponse {
  users: UserData[];
  total: number;
  skip: number;
  limit: number;
}

export abstract class UsersService {
  abstract getUsers(params?: {
    limit?: number;
    skip?: number;
    order?: string;
    search?: string;
  }): Promise<UserResponse>;
}
