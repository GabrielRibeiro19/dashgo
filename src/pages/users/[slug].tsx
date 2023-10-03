import { Input } from "@/components/Form/Input";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Button, Divider, Flex, HStack, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useMutation } from 'react-query'
import InputMask from "react-input-mask";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { queryClient } from "@/services/queryClient";
import { useRouter } from "next/router";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import axios from "axios";
import React from "react";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { setupAPIClient } from "@/services/api";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

type ViaCepAPI = {
  bairro: string;
  cep: string;
  complemento: string;
  localidade: string;
  logradouro: string;
  uf: string;
}

const updateUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('Email obrigatório').email('Email inválido'),
  cellphone: yup.string().required('Celular obrigatório'),
  cep: yup.string(),
  road: yup.string().required('Endereço obrigatório'),
  number: yup.string().required('Número obrigatório'),
  uf: yup.string(),
  complemento: yup.string(),
  cidade: yup.string(),
  password: yup.string(),
  password_confirmation: yup.string()
})

interface UpdateUser extends yup.InferType<typeof updateUserFormSchema>{
  id?: string
}

type UserProps = {
  userProps: UpdateUser
}

export default function EditUser({userProps}: UserProps) {

  const {
    id,
    cellphone,
    cep,
    cidade,
    complemento,
    email,
    name,
    number,
    road,
    uf } = userProps

  const router = useRouter()

  const { register, handleSubmit, setValue, getValues, setFocus, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(updateUserFormSchema),
    defaultValues: {
      cellphone,
      cep,
      cidade,
      complemento,
      email,
      name,
      number,
      road,
      uf,
    }
  })

  const buscarCep = async () => {
    const cep = getValues('cep')
    console.log("passei aqui")
    const cleanedCep = cep?.replace(/\D/g, '');
    const url = `https://viacep.com.br/ws/${cleanedCep}/json/`;

    try {
      const response = await axios.get(url);
      const data: ViaCepAPI = response.data;
      setValue('road', data.logradouro)
      setValue('cidade', data.localidade)
      setValue('uf', data.uf)
      setValue('complemento', data.complemento)

      setFocus('number')
    } catch (error) {
      toast.error("Erro ao buscar o CEP");
    }
  };



  const handleEditUser: SubmitHandler<UpdateUser> = async (values) => {
    try {
      const response = await api.put(`users/profile/${id}`, values)
      // console.log(response)
      toast.success('Perfil Editado com sucesso!');
      queryClient.invalidateQueries('users')

      setValue('password', '')
      setValue('password_confirmation', '')
    }

    catch (err) {
      toast.error('Ocorreu um erro.');
      console.log(err)
    }
  }
  return (
    <>
      <Head>
        <title>Perfil de {name} - Aluguel de Mesas Gonçalo</title>
      </Head>
      <Box>
        <Header />
        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <Sidebar />
          <Box
            as="form"
            flex="1"
            borderRadius={8}
            bg="gray.800"
            p={["6",
              "8"]}
            onSubmit={handleSubmit(handleEditUser)}
          >
            <Heading size="lg" fontWeight="normal">Editar Perfil</Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input label="Nome completo" {...register('name')} error={errors.name} />
                <Input type="email" label="E-mail" {...register('email')} error={errors.email} />
                <Input label="Celular" {...register('cellphone')} error={errors.cellphone} />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">

                <Input label="CEP" {...register('cep')} onBlur={buscarCep} error={errors.cep} />
                <Input label="Logradouro" {...register('road')} error={errors.road} />
                <Input label="Número" {...register('number')} error={errors.number} />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input label="Cidade" {...register('cidade')} onBlur={buscarCep} error={errors.cidade} />
                <Input label="UF" {...register('uf')} error={errors.uf} />
                <Input label="Complemento" {...register('complemento')} error={errors.complemento} />
              </SimpleGrid>

              <Divider />

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input type="password" label="Senha" {...register('password')} error={errors.password} />
                <Input type="password" {...register('password_confirmation')} label="Confirmação da senha" error={errors.password_confirmation} />
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Button as={Link} href="/users" colorScheme="whiteAlpha">Cancelar</Button>
                <Button
                  type="submit"
                  colorScheme="pink"
                  isLoading={isSubmitting}
                >Atualizar</Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const { slug } = ctx.params as ParsedUrlQuery

  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get(`users/profile/${slug}`)
  const {data} = response
  console.log(data)
  //const {users, totalCount} = await getUsers(1)
  return {
    props: {
      userProps: data
    }
  }
});
