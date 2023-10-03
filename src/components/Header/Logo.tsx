import { Text } from "@chakra-ui/react";

export function Logo() {
  return (
    <Text fontSize={["1xl", "2xl"]} fontWeight="bold" letterSpacing="tight" w="64">
      Aluguel de Mesas Piracicaba
      <Text as="span" ml="1" color="pink.500">.</Text>
    </Text>
  )
}
