import { Input } from "@/components/Form/Input";
import { Button, Flex, FormControl, FormLabel, Stack, Text } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { withSSRGuest } from "@/utils/withSSRGuest";
import { FormEvent, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContex";
import Link from "next/link";
import { parseCookies } from "nookies";

const signInFormSchema = yup.object().shape({
  email: yup.string().required('Email obrigatório').email('Email inválido'),
  password: yup.string().required('Senha obrigatória'),
})

type SignInFormData = yup.InferType<typeof signInFormSchema>;

export default function SignIn() {

  const { signIn } = useContext(AuthContext)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema)
  })

  async function handleSignIn(data: SignInFormData) {
    //console.log(data)
    const response = await signIn(data)
    if (response === true) {
      reset()
    }

  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justify="center">

      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">
          <Input type="email" label="E-mail" error={errors.email} {...register('email')} />
          <Input type="password" label="Senha" error={errors.password} {...register('password')}
          />
        </Stack>
        <Button type="submit" mt="6" colorScheme="pink" size="lg" isLoading={isSubmitting}>Entrar</Button>

        <Text as="span" mt={5}>
          <Link href="/cadastro">
            Não tem uma conta? Cadastre-se
          </Link>
        </Text>
      </Flex>


    </Flex>
  )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {

  return {
    props: {}
  }
});
