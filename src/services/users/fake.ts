import { UserResponse, UsersService } from "./interface";

const fakeUserResponse: UserResponse = {
  users: [
    {
      id: 1,
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily.johnson@x.dummyjson.com",
      image: "https://dummyjson.com/icon/emilys/128",
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "Williams",
      email: "michael.williams@x.dummyjson.com",
      image: "https://dummyjson.com/icon/michaelw/128",
    },
    {
      id: 3,
      firstName: "Sophia",
      lastName: "Brown",
      email: "sophia.brown@x.dummyjson.com",
      image: "https://dummyjson.com/icon/sophiab/128",
    },
    {
      id: 4,
      firstName: "James",
      lastName: "Davis",
      email: "james.davis@x.dummyjson.com",
      image: "https://dummyjson.com/icon/jamesd/128",
    },
  ],
  total: 4,
  skip: 0,
  limit: 4,
};

export class UsersFakeService extends UsersService {
  private latencyDuration: number;
  private errorProbability: number;

  constructor(latencyDuration = 1000, errorProbability = 0) {
    super();
    this.latencyDuration = latencyDuration;
    this.errorProbability = errorProbability;
  }

  private simulateRequest<T>(
    successCallback: () => T,
    errorCallback?: () => void
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() * 100 > this.errorProbability) {
          resolve(successCallback());
        } else {
          reject(
            errorCallback ? errorCallback() : new Error("Simulated error")
          );
        }
      }, this.latencyDuration);
    });
  }

  async getUsers(params?: {
    limit?: number;
    skip?: number;
    order?: string;
    search?: string;
  }): Promise<UserResponse> {
    return this.simulateRequest(() => {
      let users = [fakeUserResponse.users].flat();

      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        users = users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower)
        );
      }

      if (params?.order === "email:asc" || params?.order === "email:desc") {
        const direction = params.order.split(":")[1];
        users.sort((a, b) => {
          const aValue = a.email.toLowerCase();
          const bValue = b.email.toLowerCase();
          if (aValue < bValue) return direction === "desc" ? 1 : -1;
          if (aValue > bValue) return direction === "desc" ? -1 : 1;
          return 0;
        });
      }
      const limit = params?.limit ?? fakeUserResponse.limit;
      const skip = params?.skip ?? fakeUserResponse.skip;
      users = users.slice(skip, skip + limit);

      return {
        users,
        total: fakeUserResponse.total,
        skip: skip,
        limit: limit,
      };
    });
  }
}
