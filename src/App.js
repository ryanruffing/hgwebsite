import { useState } from "react";
import genie from "./genietm.png";
import { database } from "./firebase";

import { ref, set, child } from "firebase/database";
import {
  Text,
  Image,
  Center,
  Input,
  Button,
  HStack,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [error, showError] = useState(false);
  const [success, showSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const encodeEmail = (email) => {
    return btoa(email).replace(/=/g, "");
  };

  const handleAbout = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "" || !emailRegex.test(email)) {
      showError(true);
      return;
    }

    const mappingRef = ref(database, "emails");
    const encodedEmail = encodeEmail(email);

    try {
      await set(child(mappingRef, encodedEmail), email);
      showSuccess(true);
    } catch (error) {
      console.error("Error saving email:", error);
      showError(true);
      showSuccess(false);
      return;
    }
  };

  return (
    <Center minH="100vh" flexDirection="column">
      <Box position="absolute" top="20px" left="20px">
        <Button
          fontFamily="Arial"
          bgColor="#FF4E00"
          color="black"
          borderColor="#FF4E00"
          borderRadius="5"
          _hover={{ bgColor: "gray.800" }}
          onClick={handleAbout}
        >
          About
        </Button>
      </Box>
      {success && (
        <Text color={"green"} fontSize={25}>
          Successfully subscribed! We will be in touch when updates appear.
        </Text>
      )}

      <Image src={genie} maxW={250} mt={25} mb={50} />
      <Text mb={20} px={10}>
        Subscribe to receive arrival updates and free hitting advice.
      </Text>

      <HStack spacing={0}>
        <Input
          backgroundColor={"black"}
          fontFamily={"arial"}
          textColor={"white"}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          focusBorderColor="#FF4E00"
          placeholderTextColor="white"
        />
        <Button
          fontFamily={"Arial"}
          onClick={handleSaveEmail}
          bgColor="#FF4E00"
          color="black"
          borderColor="#FF4E00"
          borderRadius="5"
          _hover={{ bgColor: "gray.800" }}
        >
          Sign Up
        </Button>
      </HStack>

      {error && <Text color="red">Please enter a valid e-mail address.</Text>}
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent maxW="90vw" maxH="90vh">
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image src={genie} maxW={150} mb={4} />
            </Center>
            <ModalHeader textAlign="center">
              <u>About</u>
            </ModalHeader>{" "}
            <Box
              maxHeight="300px"
              overflowY="auto"
              padding="0.5rem"
              whiteSpace="pre-line"
            >
              <Text>
                The Hitting Genie is a mobile hitting application that allows
                you to interact through a series of questions and answers to
                improve your hitting of a baseball and softball quickly in
                realtime. It is based on The Barca Method of Hitting, a formula
                proven to expedite hitting development and long term retention.
                <br /> <br /> The Hitting Genie is the creation of Brian Barca,
                founder of The Hitting Upgrade and TK Baseball and Softball. He
                is a hitting coach who works with players from youth through
                professional levels all over the United States. <br /> <br />{" "}
                The Hitting Genie will arrive in 2024 and is the first of its
                kind resource designed to make hitting easier and instructional
                knowledge more affordable.
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Center>
  );
}

export default App;
