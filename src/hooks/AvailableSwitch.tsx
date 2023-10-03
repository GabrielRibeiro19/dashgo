import { Switch } from '@chakra-ui/react'
import { UseMutationResult } from 'react-query'

interface AvailableSwitchProps {
  id: string
  available: boolean
  useAvailable: (id: string) => UseMutationResult<
    any,
    unknown,
    {
      id: string
    },
    unknown
  >
}

export function AvailableSwitch({
  id,
  available,
  useAvailable,
}: AvailableSwitchProps) {
  const {
    isLoading: isAvailableLoading,
    isError: isAvailableError,
    mutateAsync,
  } = useAvailable(id)

  function handleAvailable() {
    mutateAsync({
      id,
    })
  }

  return (
    <Switch colorScheme='green' size='lg' onChange={handleAvailable} isChecked={available} />
  )
}
