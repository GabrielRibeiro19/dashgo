import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import dynamic from 'next/dynamic'
import { Box, Flex, SimpleGrid, Text, theme } from "@chakra-ui/react";
import { ApexOptions } from 'apexcharts';
import { withSSRAuth } from "@/utils/withSSRAuth";
import Head from "next/head";
import { parseCookies } from "nookies";
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

const options: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600],
    },
    axisTicks: {
      color: theme.colors.gray[600],
    },
    categories: [
      '2021-03-22T00:00:00.000Z',
      '2021-03-23T00:00:00.000Z',
      '2021-03-24T00:00:00.000Z',
      '2021-03-25T00:00:00.000Z',
      '2021-03-26T00:00:00.000Z',
      '2021-03-27T00:00:00.000Z',
      '2021-03-28T00:00:00.000Z',
    ]
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3
    }
  },
}

const series = [
  { name: 'series1', data: [31, 120, 10, 28, 51, 18, 109] },
]

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - Aluguel de Mesas Gonçalo</title>
      </Head>
      <Flex direction="column" h="100vh">
        <Header />

        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <Sidebar />
          <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} pb="4">
              <Text fontSize="lg" mb="4">Em breve</Text>
              <Chart options={options} series={series} type="area" height={160} />
            </Box>
            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} pb="4">
              <Text fontSize="lg" mb="4">Em breve</Text>
              <Chart options={options} series={series} type="area" height={160} />
            </Box>
          </SimpleGrid>
        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  // const apiClient = setupAPIClient(ctx)
  // const response = await apiClient.get('/me')

  // const cookies = parseCookies(ctx);
  // const { 'nextauth.refreshToken': refreshToken } = cookies;

  // console.log(cookies)

  return {
    props: {}
  }
});
