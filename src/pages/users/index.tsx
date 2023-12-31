import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { Sidebar } from "@/components/Sidebar";
import { Box, Button, Checkbox, Flex, HStack, Heading, Icon, Link, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { queryClient } from "@/services/queryClient";
import { api } from "@/services/apiClient";
import { withSSRAuth } from "@/utils/withSSRAuth";
import Head from "next/head";
import { ButtonDelete } from "@/hooks/ModalDelete";
import { useListUsers } from "@/hooks/users/listUsers";
import { useDeleteUser } from "@/hooks/users/deleteUser";
interface User {
  id: string;
  name: string;
  email: string;
  cellphone: string;
  created_at: string;
}

type userProps = {
  users: User[]
}

export default function UserList({ users }: any) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = useListUsers(page, {
    initialData: users,
  })

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  async function handlePrefetchUser({ userId }: any) {
    await queryClient.prefetchQuery(['user', userId], async () => {
      const response = await api.get('users')
      //console.log(response)
      return response.data;
    }, {
      staleTime: 1000 * 60 * 10, // 10 minutos até serem atualizados novamente.
    })
  }

  async function handleDeleteUser(id: string) {


  }

  return (
    <>
      <Head>
        <title>Usuários - Aluguel de Mesas Gonçalo</title>
      </Head>

      <Box>
        <Header />
        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px={["4", "4", "6"]}>
          <Sidebar />
          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Usuários
                {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
              </Heading>
              <NextLink href="/users/create" passHref>
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
                <Text>Falha ao obter dados dos usuários</Text>
              </Flex>
            ) : (
              <>
                <Table colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th px={["4", "4", "6"]} color="gray.300" width="8">
                        <Checkbox colorScheme="pink" />
                      </Th>
                      <Th>Usuário</Th>
                      {isWideVersion && <Th>Data de cadastro</Th>}
                      <Th width="8"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>


                    {data?.users.map((user: User) => {
                      return (
                        <Tr key={user.id}>
                          <Td px={["4", "4", "6"]}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td>
                            <Box>
                              <Link color="purple.400" href={`users/${user.id}`} onMouseEnter={() => handlePrefetchUser(user.id)}>
                                <Text fontWeight="bold">{user.name}</Text>
                              </Link>
                              <Text fontSize="sm" color="gray.300">{user.email}</Text>
                            </Box>
                          </Td>
                          {isWideVersion && <Td>{user.created_at}</Td>}

                          <Td>
                            <HStack>

                              <Button as={Link} href={`users/${user.id}`} size="sm" fontSize="sm" colorScheme="purple" leftIcon={<Icon as={RiPencilLine} fontSize="16" />}>
                                Editar
                              </Button>
                              <ButtonDelete id={user.id} description="Tem certeza que deseja excluir o usuário?" title="Excluir usuário" useDelete={useDeleteUser} />
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
