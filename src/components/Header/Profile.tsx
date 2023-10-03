import { AuthContext } from "@/contexts/AuthContex";
import { Avatar, Box, Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useContext } from "react";
import {PiSignOut} from 'react-icons/pi'

interface ProfileProps {
  showProfileData?: boolean
}

export function Profile({ showProfileData = true }: ProfileProps) {

  const { user, signOut, isAuthenticated } = useContext(AuthContext)
  const avatarUser = user?.avatar && user.avatar

  //console.log(user)

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user?.email}
          </Text>
        </Box>
      )}

      <Link href="/profile">
        <Avatar size="md" title={user?.name} name={user?.name} src={avatarUser} />
      </Link>

      <Icon as={PiSignOut} marginLeft={4} fontSize="30" cursor="pointer" onClick={signOut} title="Sair" />
    </Flex>
  )
}
