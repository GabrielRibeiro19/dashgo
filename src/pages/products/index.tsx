import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { Sidebar } from "@/components/Sidebar";
import { Box, Button, Checkbox, Flex, HStack, Heading, Icon, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, StepTitle, Switch, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { BsTrash3 } from 'react-icons/bs'
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
interface Products {
  id: string
  title: string;
  description: string;
  price: number;
  amount_available: string;
  available: boolean;
  created_at: string
}

type productProps = {
  products: Products[]
}

export default function ProductsList({ products }: any) {
  const [page, setPage] = useState(1);
  const [productSelected, setProductSelected] = useState<Products | undefined>();

  const { isOpen, onClose, onOpen } = useDisclosure()

  const { data, isLoading, isFetching, error } = useListProducts(page, {
    initialData: products,
  })


  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  async function handlePrefetchProduct({ productId }: any) {
    await queryClient.prefetchQuery(['products', productId], async () => {
      const response = await api.get('products')
      //console.log(response)
      return response.data;
    }, {
      staleTime: 1000 * 60 * 10, // 10 minutos até serem atualizados novamente.
    })
  }

  return (
    <>
      <Head>
        <title>Produtos - Aluguel de Mesas Gonçalo</title>
      </Head>

      <Box>
        <Header />
        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px={["4", "4", "6"]}>
          <Sidebar />
          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Produtos Cadastrados
                {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
              </Heading>
              <NextLink href="/products/create" passHref>
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
                      <Th>Nome</Th>
                      <Th>Preço</Th>
                      <Th>Quantidade Disponível</Th>
                      <Th>Status</Th>
                      {isWideVersion && <Th>Data de cadastro</Th>}
                      <Th width="8"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>

                    {data?.products.map((product: Products) => {
                      return (
                        <Tr key={product.id}>
                          <Td px={["4", "4", "6"]}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td>
                            <Box>
                              <Link color="purple.400" href={`products/${product.id}`} onMouseEnter={() => handlePrefetchProduct(product.id)}>
                                <Text fontWeight="bold">{product.title}</Text>
                              </Link>
                              <Text fontSize="sm" color="gray.300">{product.description}</Text>
                            </Box>
                          </Td>
                          <Td>{product.price}</Td>
                          <Td textAlign="center">{product.amount_available}</Td>
                          <Td>
                            <AvailableSwitch available={product.available} useAvailable={usePatchAvailableProduct} id={product.id} />
                          </Td>
                          {isWideVersion && <Td>{product.created_at}</Td>}


                          <Td>
                            <HStack>

                              <Button as={Link} href={`products/${product.id}`} size="sm" fontSize="sm" colorScheme="purple" leftIcon={<Icon as={RiPencilLine} fontSize="16" />}>
                                Editar
                              </Button>
                              <ButtonDelete id={product.id} description="Tem certeza que deseja excluir o produto?" title="Excluir produto" useDelete={useDeleteProduct} />
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
