import { Button, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { BsTrash3 } from "react-icons/bs"
import { UseMutationResult } from "react-query"

interface DialogDeleteProps {
  id: string
  title: string
  description: string
  useDelete: () => UseMutationResult<
    any,
    unknown,
    {
      id: string | undefined
    },
    unknown
  >
}

export function ButtonDelete({
  id,
  title,
  description,
  useDelete,
}: DialogDeleteProps) {


  const { isOpen, onClose, onOpen } = useDisclosure()


  const {
    isLoading: isDeleteCategoriesLoading,
    isError: isDeleteCategoriesError,
    mutateAsync,
  } = useDelete()

  function handleDelete() {
    mutateAsync({
      id,
    })
    onClose()
  }

  //console.log(Open)
  //console.log(open)

  return (
    <>
      <Button onClick={onOpen} size="sm" fontSize="sm" colorScheme="red">
        <Icon as={BsTrash3} fontSize="18" />
      </Button>
      <Modal key={id} blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="black">{title}</ModalHeader>
          <ModalCloseButton color="black" />
          <ModalBody>
            <Text mb='1rem' color="black">
              {description}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button colorScheme='red' onClick={handleDelete}>Excluir</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
