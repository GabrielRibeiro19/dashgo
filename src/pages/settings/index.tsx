import { Input } from "@/components/Form/Input";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Button, Divider, Flex, FormLabel, HStack, Heading, SimpleGrid, Stack, Switch, VStack } from "@chakra-ui/react";
import Link from "next/link";
import InputMask from "react-input-mask";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from "next/router";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import axios from "axios";
import React from "react";
import Head from "next/head";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { setupAPIClient } from "@/services/api";

const settingFormSchema = yup.object().shape({
  whatsapp: yup.string(),
  address: yup.string(),
  maximum_delivery_distance: yup.number(),
  minimum_amount: yup.number(),
  value_perkm: yup.number(),
  value_kmfixed: yup.number(),
  email: yup.string().email("E-mail inválido"),
  email_password: yup.string(),
  email_server: yup.string(),
  email_port: yup.string(),
  email_ssl: yup.boolean(),
})

interface SettingProps extends yup.InferType<typeof settingFormSchema> {
  id?: string
}

type Settings = {
  settingsProps: SettingProps
}

export default function Settings({ settingsProps }: Settings) {

  const {
    id,
    whatsapp,
    address,
    maximum_delivery_distance,
    minimum_amount,
    value_perkm,
    value_kmfixed,
    email,
    email_password,
    email_server,
    email_port,
    email_ssl,
  } = settingsProps

  const router = useRouter()

  const { register, handleSubmit, setValue, getValues, setFocus, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(settingFormSchema),
    defaultValues: {
      whatsapp,
      address,
      maximum_delivery_distance,
      minimum_amount,
      value_perkm,
      value_kmfixed,
      email,
      email_password,
      email_server,
      email_port,
      email_ssl,
    }
  })

  const handleEditSettings: SubmitHandler<SettingProps> = async (values) => {
    try {
      if (!settingsProps.id) {
        const response = await api.post("/settings", values)
        // console.log(response)
        toast.success('Configuração Criada com sucesso!');
      } else {
        const response = await api.put(`settings/${id}`, values)
        // console.log(response)
        toast.success('Configuração Editada com sucesso!');
      }
    }

    catch (err) {
      toast.error('Ocorreu um erro.');
      console.log(err)
    }
  }
  return (
    <>
      <Head>
        <title>Configurações - Aluguel de Mesas Gonçalo</title>
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
            onSubmit={handleSubmit(handleEditSettings)}
          >
            <Heading size="lg" fontWeight="normal">Configurações</Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input label="WhatsApp" {...register('whatsapp')} error={errors.whatsapp} />
                <Input label="Endereço" {...register('address')} error={errors.address} />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">

                <Input label="Distância máxima de entrega (KM)" {...register('maximum_delivery_distance')} error={errors.maximum_delivery_distance} />
                <Input label="Quantidade miníma para alugar" {...register('minimum_amount')} error={errors.minimum_amount} />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input label="Valor por KM" {...register('value_perkm')} error={errors.value_perkm} />
                <Input label="Valor Fixo KM (opcional)" {...register('value_kmfixed')} error={errors.value_kmfixed} />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input label="E-mail" {...register('email')} error={errors.email} />
                <Input type="password" label="Senha do email" {...register('email_password')} error={errors.email_password} />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input label="Servidor do email" {...register('email_server')} error={errors.email_server} />
                <Input label="Porta SMTP" {...register('email_port')} error={errors.email_port} />
                <Stack>
                  <FormLabel>SSL</FormLabel>
                  <Switch colorScheme='green' size='lg' {...register('email_ssl')} />
                </Stack>
              </SimpleGrid>

            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Button as={Link} href="/dashboard" colorScheme="whiteAlpha">Cancelar</Button>
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

export const getServerSideProps = withSSRAuth(async (ctx) => {

  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get("/settings")
  const { data } = response

  let values = data[0]

  if (!data[0]) {
    values = []
  }
  //const {users, totalCount} = await getUsers(1)
  return {
    props: {
      settingsProps: values
    }
  }
});
