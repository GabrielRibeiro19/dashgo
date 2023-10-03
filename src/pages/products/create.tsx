import { Input } from "@/components/Form/Input";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Button, Divider, Flex, FormLabel, HStack, Heading, SimpleGrid, Stack, Switch, VStack } from "@chakra-ui/react";
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
import React from "react";
import Head from "next/head";


type ViaCepAPI = {
  bairro: string;
  cep: string;
  complemento: string;
  localidade: string;
  logradouro: string;
  uf: string;
}

const createProductFormSchema = yup.object().shape({
  title: yup.string().required('Título obrigatório'),
  description: yup.string(),
  price: yup.string().required('Preço obrigatório'),
  amount_available: yup.string().required('Quantidade disponível obrigatório'),
  available: yup.boolean(),
})

type CreateProduct= yup.InferType<typeof createProductFormSchema>;

export default function CreateProduct() {

  const router = useRouter()

  const { register, handleSubmit, setValue, getValues, setFocus, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createProductFormSchema)
  })


  const createProduct = useMutation(async ({ title, description, price, amount_available, available }: CreateProduct) => {
    const response = await api.post('products', {
      title, description, price, amount_available, available
    })
    return response.data.products
  }, {
    onSuccess: () => {
      toast.success('Produto criado com sucesso!');
      queryClient.invalidateQueries('products')
    }
  })

  const handleCreateUser: SubmitHandler<CreateProduct> = async (values) => {
    await createProduct.mutateAsync(values)
    console.log(values)
    router.push('/products')
  }
  return (
    <>
      <Head>
        <title>Criar Produto - Aluguel de Mesas Gonçalo</title>
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
            onSubmit={handleSubmit(handleCreateUser)}
          >
            <Heading size="lg" fontWeight="normal">Criar produto</Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input label="Título" {...register('title')} error={errors.title} />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input label="Descrição" {...register('description')} error={errors.description} />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input label="Preço R$" {...register('price')} error={errors.price} />
                <Input label="Quantidade Disponível" {...register('amount_available')} error={errors.amount_available} />
                <Stack>
                  <FormLabel>Status</FormLabel>
                  <Switch colorScheme='green' size='lg' {...register('available')} />
                </Stack>
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Button as={Link} href="/products" colorScheme="whiteAlpha">Cancelar</Button>
                <Button
                  type="submit"
                  colorScheme="pink"
                  isLoading={isSubmitting}
                >Salvar</Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  )
}
