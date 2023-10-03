import { api } from "@/services/apiClient";
import { AxiosErrorWithMessage } from "@/services/errorMessage";
import { queryClient } from "@/services/queryClient";
import { useMutation } from "react-query";
import { toast } from 'react-toastify'

interface Order {
  draft: boolean;
  status: string;
  form_payment: string;
  payment: boolean;
  delivery_date: Date;
  delivery_local: string;
  observation: string;
  user_id: string;
}

const createOrder = async (params: Order) => {
  const { data } = await api.post('orders', {
    draft: params.draft,
    status: params.status,
    form_payment: params.form_payment,
    payment: params.payment,
    delivery_date: params.delivery_date,
    delivery_local: params.delivery_local,
    observation: params.observation,
    user_id: params.user_id
  })

  return data
}

export const useCreateOrder = () => {
  return useMutation(createOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })

      toast.success('Pedido criado com sucesso')
    },
    onError: (error) => {
      const err = error as AxiosErrorWithMessage

      toast.error(`Ops... ${err.response?.data.message}`, {
        toastId: 'Error',
      })
    },
  })
}
