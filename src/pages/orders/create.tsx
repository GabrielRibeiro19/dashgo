import { Input } from "@/components/Form/Input";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Flex, FormLabel, HStack, Heading, Image, Select, SimpleGrid, Stack, Switch, Text, Textarea, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useMutation } from 'react-query'
import InputMask from "react-input-mask";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { queryClient } from "@/services/queryClient";
import { useRouter } from "next/router";
import { api } from "@/services/apiClient";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import React, { useState } from "react";
import Head from "next/head";
import { useListAllUsers } from "@/hooks/users/listAllUsers";
import MyDatePicker from "@/components/DatePicker";
import { useCreateOrder } from "@/hooks/orders/createOrder";
import { useListProducts } from "@/hooks/products/listProducts";
import { BsPencil } from "react-icons/bs";


const createOrderFormSchema = yup.object().shape({
  draft: yup.boolean(),
  status: yup.string().required("Status Obrigatório"),
  form_payment: yup.string().required("Forma de Pagamento Obrigatória"),
  payment: yup.boolean(),
  delivery_date: yup.date(),
  delivery_local: yup.string().required("Local da Entrega Obrigatório"),
  observation: yup.string(),
  user_id: yup.string(),
})

type CreateOrder = yup.InferType<typeof createOrderFormSchema>;

type User = {
  name: string;
  email: string;
  cellphone: string;
  cep: string;
  road: string;
  number: string;
  id: string;
  avatar: string;
  complemento: string;
  cidade: string;
  uf: string;
}

type Item = {
  amount: string
  product_id: string
}

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  amount_available: number;
  available: boolean;
}


export default function CreateOrder() {
  const users = useListAllUsers()
  const products = useListProducts(1)
  const [cart, setCart] = useState<Item[]>([]);

  const router = useRouter()

  const { register, handleSubmit, setValue, getValues, reset, control, setFocus, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createOrderFormSchema),
    defaultValues: {
      draft: false,
      status: "Pedido Realizado",
      form_payment: "Pix",
      payment: false,
    }
  })

  const {
    isLoading: isCreateOrder,
    isError: isCreateOrderError,
    mutateAsync: mutateCreateOrder,
  } = useCreateOrder()


  async function FindUser(user_id: string) {
    const response = await api.get(`/users/profile/${user_id}`)
    const user: User = response.data
    const local = user.road + ', ' + user.number

    const initialCart: Product[] = [];

    setValue('delivery_local', local)
  }

  async function handleCreateOrder(values: CreateOrder) {
    await mutateCreateOrder(values)
    reset()
  }

  function addCart(product: Product){

    const item:Item = {
      amount: 1,
      product_id: product.id
    }

    // Verifique se o item já está no carrinho
    if (cart) {
      const existingItem = cart.find((cartItem) => cartItem.product_id === product.id);
      if (existingItem) {
        console.log('Produto já está no carrinho' + existingItem)
        // Se o item já estiver no carrinho, atualize a quantidade
        existingItem.amount += 1;
        setCart(...cart);
      }
    }
    else {
      // Caso contrário, adicione o item ao carrinho
      setCart(...cart, produ);
    }


    toast.success("Produto adicionado com sucesso")

    console.log(cart)
  }

  return (
    <>
      <Head>
        <title>Criar Pedido - Aluguel de Mesas Gonçalo</title>
      </Head>
      <Box>
        <Header />
        <ToastContainer />
        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <Sidebar />
          <Box
            as="form"
            flex="1"
            borderRadius={8}
            bg="gray.800"
            p={["6",
              "8"]}
            onSubmit={handleSubmit(handleCreateOrder)}
          >
            <Heading size="lg" fontWeight="normal">Criar Pedido</Heading>

            <HStack pt={5}>

            {products.data?.products.map((product) => (

              <Card maxW='sm' key={product.id} bg="gray.300">
                <CardBody>
                  <Image
                    src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                  />
                  <Stack mt='6' spacing='3'>
                    <Heading size='md' color="white">{product.title}</Heading>
                    <Text color="white">
                      {product.description}
                    </Text>
                    <Text color="white" fontSize='2xl'>
                      {product.price}
                    </Text>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing='2'>
                    <Button variant='solid' colorScheme='blue' onClick={() => addCart(product)}>
                      Adicionar ao pedido
                    </Button>
                    <Button as={Link} href={`/products/${product.id}`} variant='ghost' colorScheme='green' leftIcon={<BsPencil/>}>
                      Editar Produto
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            ))}
            </HStack>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">

                <Select textColor="white" {...register('user_id')} onChange={(e: any) => FindUser(e.target.value)}>
                  <option value="" selected disabled>Selecione um usuário</option>
                  {users.data?.map((user: any) => (
                    <option key={user.id} style={{ color: 'black' }} value={user.id}>{user.name} - {user.road}, {user.number}</option>
                  ))}
                </Select>
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Stack>
                  <FormLabel>Rascunho</FormLabel>
                  <Switch colorScheme='green' size='lg' {...register('draft')} />
                </Stack>
                <Input label="Status" {...register('status')} error={errors.status} placeholder="Ex: Pedido Realizado, Pago" />
                <Input label="Forma de Pagamento" {...register('form_payment')} placeholder="Ex: Pix, Crédito, Débito" error={errors.form_payment} />
                <Stack>
                  <FormLabel>Não Pago/Pago</FormLabel>
                  <Switch colorScheme='green' size='lg' {...register('payment')} />
                </Stack>
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Stack gap="0">
                  <FormLabel>Data da Entrega</FormLabel>
                  <MyDatePicker control={control} {...register('delivery_date')} />
                </Stack>
                <Input label="Local da Entrega" placeholder="Endereço para a entrega" {...register('delivery_local')} error={errors.delivery_local} />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <VStack>
                  <FormLabel>Observação</FormLabel>
                  <Textarea {...register('observation')}>
                  </Textarea>
                </VStack>
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Button as={Link} href="/orders" colorScheme="whiteAlpha">Cancelar</Button>
                <Button
                  type="submit"
                  colorScheme="pink"
                  isLoading={isSubmitting}
                >Criar Pedido</Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  )
}
