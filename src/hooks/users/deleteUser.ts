
import { api } from "@/services/apiClient";
import { AxiosErrorWithMessage } from "@/services/errorMessage";
import { queryClient } from "@/services/queryClient";
import { UseQueryOptions, useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

export type DeleteUserQueryParams = {
  id: string
}

const deleteUser = async (params: DeleteUserQueryParams) => {
  const { data } = await api.delete(`users/${params.id}`)
  return data
}

export const useDeleteUser = () => {
  return useMutation(deleteUser, {
    onSuccess: () => {

      queryClient.invalidateQueries('users')

      toast.success('Usuário deletado com sucesso!')
    },
    onError: (error) => {
      const err = error as AxiosErrorWithMessage

      toast.error(`Ops... ${err.response?.data.message}`, {
        toastId: 'Error',
      })
    },
  })
}
