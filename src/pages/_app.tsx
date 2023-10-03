import '../styles/global.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@/styles/theme'
import { SidebarDrawerProvider } from '@/contexts/SidebarDrawerContext'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { queryClient } from '@/services/queryClient'
import { AuthProvider } from '@/contexts/AuthContex'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'

// Registre a localização em português do Brasil
registerLocale('pt-BR', ptBR);

// Defina a localização padrão
setDefaultLocale('pt-BR');

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider theme={theme}>

          <SidebarDrawerProvider>
            <Component {...pageProps} />
            <ToastContainer />
          </SidebarDrawerProvider>
        </ChakraProvider>

        <ReactQueryDevtools />
      </AuthProvider>
    </QueryClientProvider>
  )
}
