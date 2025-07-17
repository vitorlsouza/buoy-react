import { UserResponse, UsersService } from "./interface";

export class UsersApiService extends UsersService {
  private baseUrl = "https://dummyjson.com/users";

  private async fetchFromApi(url: string): Promise<any> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getUsers(params?: {
    limit?: number;
    skip?: number;
    order?: string;
    search?: string;
  }): Promise<UserResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit !== undefined)
      queryParams.append("limit", params.limit.toString());
    if (params?.skip !== undefined)
      queryParams.append("skip", params.skip.toString());

    if (params?.order === "email:asc") {
      queryParams.append("sortBy", "email");
      queryParams.append("order", "asc");
    } else if (params?.order === "email:desc") {
      queryParams.append("sortBy", "email");
      queryParams.append("order", "desc");
    }

    let url: string;

    if (params?.search) {
      queryParams.append("q", params.search);
      url = `${this.baseUrl}/search?${queryParams.toString()}`;
    } else {
      url = `${this.baseUrl}${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;
    }

    const response = await this.fetchFromApi(url);
    return response;
  }
}
