import { Input } from "@/components/Form/Input";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Button, Divider, Flex, HStack, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
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
import { withSSRGuest } from "@/utils/withSSRGuest";
import Head from "next/head";

type CreateUserFormData = {
  name: string;
  email: string
  password: string;
  cellphone: string;
  avatar?: string;
  cep?: string;
  complemento?: string;
  cidade?: string;
  uf?: string;
  road: string;
  number: string;
  senha_confirmacao: string
}

type ViaCepAPI = {
  bairro: string;
  cep: string;
  complemento: string;
  localidade: string;
  logradouro: string;
  uf: string;
}

const createUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('Email obrigatório').email('Email inválido'),
  cellphone: yup.string().required('Celular obrigatório'),
  cep: yup.string(),
  road: yup.string().required('Endereço obrigatório'),
  number: yup.string().required('Número obrigatório'),
  uf: yup.string(),
  complemento: yup.string(),
  cidade: yup.string(),
  password: yup.string().required('Senha obrigatória').min(6, 'No mínimo 6 caracteres'),
  password_confirmation: yup.string().required("A confirmação de senha é obrigatória.").oneOf([
    yup.ref('password'),
  ], 'As senhas precisam ser iguais'
  )
})

export default function Cadastro() {

  const router = useRouter()

  const { register, handleSubmit, setValue, getValues, setFocus, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createUserFormSchema)
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
      toast.error("Erro ao buscar o CEP: " + cep);
    }
  };

  const createUser = useMutation(async ({ name, email, password, cellphone, number, road, complemento, cidade, uf, cep }: CreateUserFormData) => {
    const response = await api.post('users', {
      name, email, password, cellphone, number, road, cep, complemento, cidade, uf
    })
    return response.data.user
  }, {
    onSuccess: () => {
      toast.success('Cadastro realizado com sucesso!');
    }
  })

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
    await createUser.mutateAsync(values)
    router.push('/')
  }
  return (
    <>
      <Head>
        <title>Criar Conta - Aluguel de Mesas Gonçalo</title>
      </Head>
      <Flex
        w="100vw"
        h="100vh"

        alignItems="center"
        justify="center">
        <Flex w="100%" my="6" maxWidth={1080} mx="auto" px="6">
          <Box
            as="form"
            flex="1"
            borderRadius={8}
            bg="gray.800"
            p={["6",
              "8"]}
            onSubmit={handleSubmit(handleCreateUser)}
          >
            <Heading size="lg" fontWeight="normal">Cadastro</Heading>

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

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input type="password" label="Senha" {...register('password')} error={errors.password} />
                <Input type="password" {...register('password_confirmation')} label="Confirmação da senha" error={errors.password_confirmation} />
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end" alignItems="center">
              <HStack spacing="4">
                <Text as="span" >
                  <Link href="/">
                    Já tem uma conta? <Text as="span" color="green.400">Faça login</Text>
                  </Link>
                </Text>
                <Button
                  type="submit"
                  colorScheme="pink"
                  isLoading={isSubmitting}
                >Criar conta</Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});
