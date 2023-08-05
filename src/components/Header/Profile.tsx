import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Gabriel Ribeiro</Text>
          <Text color="gray.300" fontSize="small">
            gabriel.hsribeiro19@gmail.com
          </Text>
        </Box>
      )}

      <Avatar size="md" name="Gabriel Ribeiro" src="https://github.com/GabrielRibeiro19.png" />
    </Flex>
  )
}
