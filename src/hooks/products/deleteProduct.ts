
import { api } from "@/services/apiClient";
import { AxiosErrorWithMessage } from "@/services/errorMessage";
import { queryClient } from "@/services/queryClient";
import { UseQueryOptions, useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

export type DeleteProductsQueryParams = {
  id: string
}

const deleteProduct = async (params: DeleteProductsQueryParams) => {
  const { data } = await api.delete(`products/${params.id}`)
  return data
}

export const useDeleteProduct = () => {
  return useMutation(deleteProduct, {
    onSuccess: () => {

      queryClient.invalidateQueries('products')

      toast.success('Produto deletado com sucesso!')
    },
    onError: (error) => {
      const err = error as AxiosErrorWithMessage

      toast.error(`Ops... ${err.response?.data.message}`, {
        toastId: 'Error',
      })
    },
  })
}
