import { Input } from "@/components/Form/Input";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Button, Divider, Flex, HStack, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from "next/link";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type CreateUserFormData = {
  name: string;
  email: string
  password: string;
  password_confirmation: string
}

const createUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('Email obrigatório').email('Email inválido'),
  password: yup.string().required('Senha obrigatória').min(6, 'No mínimo 6 caracteres'),
  password_confirmation: yup.string().oneOf([
    null, yup.ref('password')
  ], 'As senhas precisam ser iguais'
  )
})

const handleCreateUser: SubmitHandler<CreateUserFormData> = (values) => {
  console.log(values)
}

export default function CreateUser() {
  const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })
  return (
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
          onSubmit={handleSubmit(handleCreateUser)}
          >
          <Heading size="lg" fontWeight="normal">Criar usuário</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input label="Nome completo" {...register('name')} error={errors.name} />
              <Input type="email" label="E-mail" {...register('email')} error={errors.email}/>
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input type="password" label="Senha" {...register('password')} error={errors.password}/>
              <Input type="password" {...register('password_confirmation')} label="Confirmação da senha" error={errors.password_confirmation}/>
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
                <Button as={Link} href="/users" colorScheme="whiteAlpha">Cancelar</Button>
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
  )
}
