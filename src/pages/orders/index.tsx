import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { Sidebar } from "@/components/Sidebar";
import { Box, Button, Checkbox, Flex, HStack, Heading, Icon, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, StepTitle, Switch, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { BsEye, BsTrash3, BsWhatsapp } from 'react-icons/bs'
import { queryClient } from "@/services/queryClient";
import { api } from "@/services/apiClient";
import { withSSRAuth } from "@/utils/withSSRAuth";
import Head from "next/head";
import { toast } from "react-toastify";
import { useListProducts } from "@/hooks/products/listProducts";
import { useDeleteProduct } from "@/hooks/products/deleteProduct";
import { ButtonDelete } from "@/hooks/ModalDelete";
import { usePatchAvailableProduct } from "@/hooks/products/patchAvailableProduct";
import { AvailableSwitch } from "@/hooks/AvailableSwitch";
import { useListOrders } from "@/hooks/orders/listOrders";

type User = {
  id: string;
  name: string;
  email: string;
  cellphone: string;
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
  items: Items[]
  created_at: string
}

type orderProps = {
  orders: Order[]
}

type ValoresProps = {
  price: number[]
}

export default function OrdersList({ orders }: orderProps | undefined | any) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = useListOrders(page, {
    initialData: orders,
  })

  console.log(data?.orders)


  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  async function handlePrefetchProduct({ productId }: any) {
    await queryClient.prefetchQuery(['products', productId], async () => {
      const response = await api.get('products')
      return response.data;
    }, {
      staleTime: 1000 * 60 * 10, // 10 minutos até serem atualizados novamente.
    })
  }

  function SomarTotal(valores: ValoresProps) {
    const total = valores.price.reduce((sum, nr) => sum + nr, 0);
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <>
      <Head>
        <title>Pedidos - Aluguel de Mesas Gonçalo</title>
      </Head>

      <Box>
        <Header />
        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px={["4", "4", "6"]}>
          <Sidebar />
          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Pedidos Realizados
                {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
              </Heading>
              <NextLink href="/orders/create" passHref>
                <Button as="button" size="sm" fontSize="sm" colorScheme="pink" leftIcon={<Icon as={RiAddLine} fontSize="20" />}>
                  Criar novo
                </Button>
              </NextLink>
            </Flex>
            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>Falha ao obter dados dos produtos</Text>
              </Flex>
            ) : (
              <>
                <Table colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th px={["4", "4", "6"]} color="gray.300" width="8">
                        <Checkbox colorScheme="pink" />
                      </Th>
                      <Th>Usuário/Local</Th>
                      <Th>Produtos/quantidade</Th>
                      <Th>WhatsApp</Th>
                      <Th>Status</Th>
                      <Th>Total</Th>
                      {isWideVersion && <Th>Data do pedido</Th>}
                      <Th width="8"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>

                    {data?.orders.map((order: Order) => {
                      return (
                        <Tr key={order.id}>
                          <Td px={["4", "4", "6"]}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td>
                            <Box>
                              <Link color="purple.400" href={`users/${order.user.id}`} onMouseEnter={() => handlePrefetchProduct(order.id)}>
                                <Text fontWeight="bold">{order.user.name}</Text>
                              </Link>
                              <Text fontSize="sm" color="gray.300">{order.delivery_local}</Text>
                            </Box>
                          </Td>
                          <Td>
                            {order.items.map((item: Items) => (
                              <Box key={item.id}>
                                <Link color="purple.400" href={`products/${item.product.id}`} onMouseEnter={() => handlePrefetchProduct(item.product.id)}>
                                  <Text fontWeight="bold">{item.product.title}</Text>
                                </Link>
                                <Text fontSize="sm" color="gray.300">x{item.amount}</Text>
                              </Box>

                            ))}
                          </Td>
                          <Td>
                            <Button size="sm" fontSize="sm" padding={3} paddingY={"20px"} colorScheme="green" leftIcon={<Icon as={BsWhatsapp} fontSize="16" />}>
                              <a href={`https://api.whatsapp.com/send?phone=55${order.user.cellphone}&text=Olá`} target="_blank">
                                Chamar<br />
                                {order.user.cellphone}
                              </a>
                            </Button>
                          </Td>
                          <Td>{order.status}</Td>
                          <Td>{SomarTotal({ price: order.items.map((item) => item.product.price) })}</Td>
                          {isWideVersion && <Td>{order.created_at}</Td>}
                          {/* <Td>
                            <AvailableSwitch available={order.payment} useAvailable={usePatchAvailableProduct} id={order.id} />
                          </Td>
                          <Td>{order.draft}</Td> */}
                          {/* <Td textAlign="center">{order.form_payment}</Td> */}


                          <Td>
                            <HStack>

                              <Button as={Link} href={`orders/${order.id}`} size="sm" fontSize="sm" colorScheme="purple" leftIcon={<Icon as={RiPencilLine} fontSize="16" />}>
                                Editar
                              </Button>
                              <Button as={Link} href={`orders/view/${order.id}`} size="sm" fontSize="sm" colorScheme="green" leftIcon={<Icon as={BsEye} fontSize="16" />}>
                                Ver
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      )
                    })}

                  </Tbody>
                </Table>
                {data?.totalCount && (
                  <Pagination
                    totalCountOfRegisters={data.totalCount}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  // const apiClient = setupAPIClient(ctx)
  // const response = await apiClient.get('/me')
  //const {users, totalCount} = await getUsers(1)
  return {
    props: {

    }
  }
});

// export const getServerSideProps: GetServerSideProps = async () => {
//const {users, totalCount} = await getUsers(1)

//   return {
//     props: {
//       users
//     }
//   }
// }
