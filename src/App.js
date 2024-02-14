import { useState, useEffect } from "react";
import genie from "./genietm.png";
import { database } from "./firebase";
import { ref, get } from "firebase/database";
import { Helmet } from "react-helmet";

import {
  Text,
  Image,
  Center,
  Input,
  Button,
  HStack,
  VStack,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import "./App.css";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [error, showError] = useState(false);
  const [success, showSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aboutContent, setAboutContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const aboutRef = ref(database, "about");
    get(aboutRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setAboutContent(snapshot.val());
        } else {
          console.log("No about content available");
        }
      })
      .catch((error) => {
        console.error("Error fetching about content:", error);
      });
  }, []);

  const handleAbout = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const addMember = async (email, firstName, lastName) => {
    try {
      const response = await axios.post(
        "https://hgapi.vercel.app/api/users/subscribe",
        {
          email: email,
          status: "subscribed",
          firstName: firstName,
          lastName: lastName,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding member to list:", error);
      throw error;
    }
  };

  const handleSaveEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "" || !emailRegex.test(email)) {
      setErrorMsg("Please enter a valid e-mail address.");
      showError(true);
      return;
    } else if (firstName === "") {
      setErrorMsg(
        "Please enter your first name to avoid e-mail being marked as spam."
      );
      showError(true);
      return;
    } else if (lastName === "") {
      setErrorMsg(
        "Please enter your last name to avoid e-mail being marked as spam."
      );
      showError(true);
      return;
    }

    try {
      await addMember(email, firstName, lastName);
      showSuccess(true);
      showError(false);
    } catch (error) {
      console.error("Error saving email:", error);
      if (error.response && error.response.status === 500) {
        setErrorMsg(
          "This e-mail is already in use. Please try again with a different e-mail."
        );
      } else {
        setErrorMsg("An error occurred. Please try again later.");
      }
      showError(true);
      showSuccess(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Hitting Genie</title>
        <link
          rel="icon"
          type="image/png"
          href="%PUBLIC_URL%/favicon.ico"
          sizes="16x16"
        />
      </Helmet>

      <Center minH="100vh" flexDirection="column">
        <Box position="absolute" top="20px" left="20px">
          <Button
            fontFamily="Arial"
            bgColor="#FF4E00"
            color="black"
            borderColor="#FF4E00"
            borderRadius="5"
            onClick={handleAbout}
          >
            About
          </Button>
        </Box>
        {success && (
          <Text color={"green"} fontSize={25} pt={20} ml={10} mr={10}>
            Successfully subscribed! We will be in touch when updates appear.
          </Text>
        )}

        <Image src={genie} maxW={{ base: "20", md: "80%", lg: "30%" }} mt={25} mb={50} />
        <Text mb={20} px={10} fontSize={32} fontWeight={"bold"} align={"center"}>
          Subscribe to receive arrival updates and free hitting advice.
        </Text>
        <VStack spacing={2}>
          {" "}
          {/* Use VStack for vertical stack on small screens */}
          <Input
            backgroundColor={"black"}
            fontFamily={"arial"}
            textColor={"white"}
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            focusBorderColor="#FF4E00"
            placeholderTextColor="white"
            maxW={{ base: "100", md: "100%", lg: "100%" }}// Adjust width based on screen size
          />
          <Input
            backgroundColor={"black"}
            fontFamily={"arial"}
            textColor={"white"}
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            focusBorderColor="#FF4E00"
            placeholderTextColor="white"
            maxW={{ base: "100", md: "100%", lg: "100%" }} // Adjust width based on screen size
          />
          <HStack spacing={0} width="100%">
            {" "}
            {/* Use HStack for horizontal stack */}
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
              width={{ base: "80%", md: "auto" }} // Adjust width based on screen size
            />
            <Button
              fontFamily={"Arial"}
              onClick={handleSaveEmail}
              bgColor="#FF4E00"
              color="black"
              borderColor="#FF4E00"
              borderRadius="5"
              width={{ base: "80%", md: "auto" }} // Adjust width based on screen size
            >
              Sign Up
            </Button>
          </HStack>
        </VStack>

        {error && <Text color="red">{errorMsg}</Text>}
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
                <Text>{aboutContent}</Text>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Center>
    </>
  );
}

export default App;
