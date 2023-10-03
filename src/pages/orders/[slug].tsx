import { Input } from "@/components/Form/Input";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Button, Divider, Flex, FormLabel, HStack, Heading, Icon, InputGroup, SimpleGrid, Stack, Switch, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useMutation } from 'react-query'
import InputMask from "react-input-mask";

import { SubmitHandler, useForm, UseFormRegisterReturn } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { queryClient } from "@/services/queryClient";
import { useRouter } from "next/router";
import { api } from "@/services/apiClient";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import React, {ReactNode, useRef} from "react";
import Head from "next/head";
import { setupAPIClient } from "@/services/api";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { ParsedUrlQuery } from "querystring";
import { AiFillFile } from "react-icons/ai";

const updateProductFormSchema = yup.object().shape({
  title: yup.string().required('Título obrigatório'),
  description: yup.string(),
  price: yup.string().required('Preço obrigatório'),
  amount_available: yup.string().required('Quantidade disponível obrigatório'),
  available: yup.boolean(),
})

interface UpdateProduct extends yup.InferType<typeof updateProductFormSchema>{
  id?: string
}

type ProductProps = {
  productProps: UpdateProduct
}


type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
  multiple?: boolean
  children?: ReactNode
}

export default function EditProduct({productProps}: ProductProps) {

  const router = useRouter()

  const {
    id,
    title,
    amount_available,
    price,
    available,
    description
  } = productProps

  const { register, handleSubmit, setValue, getValues, setFocus, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(updateProductFormSchema),
    defaultValues: {
      title,
      amount_available,
      price,
      available,
      description,
    }
  })


  const updateProduct = useMutation(async ({title, description, price, amount_available, available }: UpdateProduct) => {
    const response = await api.put(`products/${id}`, {
      title, description, price, amount_available, available
    })
    return response.data.products
  }, {
    onSuccess: () => {
      toast.success('Produto editado com sucesso!');
      queryClient.invalidateQueries('products')
    }
  })

  const handleUpdateProduct: SubmitHandler<UpdateProduct> = async (values) => {
    await updateProduct.mutateAsync(values)
    router.push('/products')
  }

  const FileUpload = (props: FileUploadProps) => {
    const { register, accept, multiple, children } = props
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { ref, ...rest } = register as {ref: (instance: HTMLInputElement | null) => void}

    const handleClick = () => inputRef.current?.click()

    return (
        <InputGroup onClick={handleClick}>
          <input
            type={'file'}
            multiple={multiple || false}
            hidden
            accept={accept}
            {...rest}
            ref={(e) => {
              ref(e)
              inputRef.current = e
            }}
          />
          <>
            {children}
          </>
        </InputGroup>
    )
  }

  return (
    <>
      <Head>
        <title>Editar Produto {title} - Aluguel de Mesas Gonçalo</title>
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
            onSubmit={handleSubmit(handleUpdateProduct)}
          >
            <Heading size="lg" fontWeight="normal">Editando o produto: {title}</Heading>

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
          <FileUpload
            accept={'image/*'}
            multiple
            register={register('file_')}
          >
            <Button leftIcon={<Icon as={AiFillFile} />}>
              Upload de Imagens
            </Button>
          </FileUpload>
          </Box>
        </Flex>
      </Box>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const { slug } = ctx.params as ParsedUrlQuery

  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get(`products/${slug}`)
  const {data} = response
  console.log(data)
  //const {users, totalCount} = await getUsers(1)
  return {
    props: {
      productProps: data
    }
  }
});
