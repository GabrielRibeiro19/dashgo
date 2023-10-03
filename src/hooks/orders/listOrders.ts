
import { api } from "@/services/apiClient";
import { UseQueryOptions, useQuery } from "react-query";

type User = {
  id: string;
  name: string;
  email: string;
}

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  amount_available: number;
}

type Items = {
  id: string;
  amount: number;
  product: Product;
}

interface Order {
  id: string;
  draft: boolean;
  status: string;
  form_payment: string;
  payment: boolean;
  delivery_date: Date;
  delivery_local: string;
  observation: string;
  user: User
  items: Items
  created_at: string
}

type GetOrdersResponse = {
  totalCount: number;
  orders: Order[]
}

export async function listOrders(page: number): Promise<GetOrdersResponse> {
    const { data, headers } = await api.get("orders", {
      params: {
        page,
      }
    })

    //console.log(data.length)

    // const totalCount = Number(headers['x-total-count'])
    const totalCount = Number(data.length)

    const orders = data.map((order: Order) => {
      return {
        id: order.id,
        draft: order.draft,
        status: order.status,
        form_payment: order.form_payment,
        payment: order.payment,
        delivery_date: new Date(order.delivery_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
        }),
        delivery_local: order.delivery_local,
        observation: order.observation,
        user: order.user,
        items: order.items,
        created_at: new Date(order.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      };
    });
    console.log(orders)
    return {
      orders,
      totalCount
    };
  }

  export function useListOrders(page: number, options?: UseQueryOptions<GetOrdersResponse, unknown, GetOrdersResponse, ["orders", number]>) {
    return useQuery(["orders", page], () => listOrders(page), {
      staleTime: 1000 * 60 * 10, // 10 minutes
      ...options
    });
  }
