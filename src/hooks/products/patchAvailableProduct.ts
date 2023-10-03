import { api } from '@/services/apiClient'
import { AxiosErrorWithMessage } from '@/services/errorMessage'
import { queryClient } from '@/services/queryClient'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

export type PatchAvailableClientsQueryParams = {
  id: string
}

let productId = ''

const patchAvailableProduct = async (
  params: PatchAvailableClientsQueryParams,
) => {
  productId = params.id
  const { data } = await api.patch(`/products/${params.id}`)

  return data
}

export const usePatchAvailableProduct = () => {
  return useMutation(patchAvailableProduct, {
    onSuccess: () => {
      console.log(productId)
      queryClient.invalidateQueries('products')

      toast.success('Produto atualizado com sucesso!')
    },
    onError: (error) => {
      const err = error as AxiosErrorWithMessage

      toast.error(`Ops... ${err.response?.data.message}`, {
        toastId: 'Error',
      })
    },
  })
}
