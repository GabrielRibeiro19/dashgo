
import { api } from "@/services/apiClient";
import { UseQueryOptions, useQuery } from "react-query";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  amount_available: string;
  available: boolean;
  created_at: string
}

type GetProductsResponse = {
  totalCount: number;
  products: Product[]
}

export async function listProducts(page: number): Promise<GetProductsResponse> {
    const { data, headers } = await api.get("products", {
      params: {
        page,
      }
    })

    console.log(data.length)

    // const totalCount = Number(headers['x-total-count'])
    const totalCount = Number(data.length)

    const products = data.map((product: Product) => {
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price.toLocaleString("pt-br", {currency: "BRL", style: "currency"}),
        amount_available: product.amount_available,
        available: product.available,
        created_at: new Date(product.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      };
    });
    return {
      products,
      totalCount
    };
  }

  export function useListProducts(page: number, options?: UseQueryOptions<GetProductsResponse, unknown, GetProductsResponse, ["products", number]>) {
    return useQuery(["products", page], () => listProducts(page), {
      staleTime: 1000 * 60 * 10, // 10 minutes
      ...options
    });
  }
