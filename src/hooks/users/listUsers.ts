
import { api } from "@/services/apiClient";
import { UseQueryOptions, useQuery } from "react-query";

type User = {
  id: string;
  name: string;
  email: string;
  cellphone: string;
  created_at: string;
}

type GetUsersResponse = {
  totalCount: number;
  users: User[]
}

export async function listUsers(page: number): Promise<GetUsersResponse> {
    const { data, headers } = await api.get("users", {
      params: {
        page,
      }
    })

    const totalCount = Number(data.length)

    const users = data.map((user: User) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        celular: user.cellphone,
        created_at: new Date(user.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      };
    });
    return {
      users,
      totalCount
    };
  }

  export function useListUsers(page: number, options?: UseQueryOptions<GetUsersResponse, unknown, GetUsersResponse, ["users", number]>) {
    return useQuery(["users", page], () => listUsers(page), {
      staleTime: 1000 * 60 * 10, // 10 minutes
      ...options
    });
  }
