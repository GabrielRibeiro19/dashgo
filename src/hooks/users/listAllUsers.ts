
import { api } from "@/services/apiClient";
import { UseQueryOptions, useQuery } from "react-query";

type User = {
  id: string;
  name: string;
  email: string;
  cellphone: string;
  road: string;
  number: string;
  created_at: string;
}

export async function listAllUsers(): Promise<User[]> {
    const {data} = await api.get("users")
    return data
  }


  export function useListAllUsers() {
    return useQuery(["users"], () => listAllUsers());
  }
