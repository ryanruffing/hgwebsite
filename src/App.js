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
  VStack,
  FormControl,
  FormLabel,
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
      <Center mt={10}>
      <Text
          px={10}
          fontSize={[100, 75, 50, 24]}
          fontWeight={"bold"}
          align={"center"}
        >
          Now available for iOS!
        </Text>
        <a href="https://apps.apple.com/us/app/hitting-genie/id6478901041" target="_blank" rel="noopener noreferrer">
          <Image src="appstore.png" alt="Download on the App Store" />
        </a>
      </Center>
      
      <Center minH="75vh" flexDirection="column">
        <Box position="absolute" top="20px" left="20px">
          <Button
            height={"100%"}
            fontFamily="Arial"
            fontSize={[100, 75, 50, 24]}
            bgColor="#FF4E00"
            color="black"
            borderColor="#FF4E00"
            borderRadius="5"
            onClick={handleAbout}
          >
            About
          </Button>
        </Box>
        
        <Image
          src={genie}
          maxW={{ base: "20", md: "80%", lg: "30%" }}
          mt={25}
          mb={50}
        />
        
        <Text
          px={10}
          fontSize={[100, 75, 50, 24]}
          fontWeight={"bold"}
          align={"center"}
        >
          Subscribe to receive arrival updates and free hitting advice.
        </Text>
        
        {success && (
          <Text
            color={"green"}
            fontSize={[100, 75, 50, 24]}
            align={"center"}
            pt={20}
            ml={10}
            mr={10}
          >
            Successfully subscribed! We will be in touch when updates appear.
          </Text>
        )}
        
        <VStack spacing={5} width={["100%", "70%", "95%", "35%", "35%"]}>
          <FormControl isRequired>
            <FormLabel fontSize={[100, 75, 50, 24]}>First Name</FormLabel>
            <Input
              height={"100%"}
              backgroundColor={"black"}
              fontFamily={"arial"}
              textColor={"white"}
              fontSize={[100, 75, 50, 24]}
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              focusBorderColor="#FF4E00"
              placeholderTextColor="white"
            />
          </FormControl>
          
          <FormControl id="lastName" isRequired>
            <FormLabel fontSize={[100, 75, 50, 24]}>Last Name</FormLabel>
            <Input
              height={"100%"}
              backgroundColor={"black"}
              fontFamily={"arial"}
              fontSize={[100, 75, 50, 24]}
              textColor={"white"}
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              focusBorderColor="#FF4E00"
              placeholderTextColor="white"
            />
          </FormControl>
          
          <FormControl id="email" isRequired>
            <FormLabel fontSize={[100, 75, 50, 24]}>Email Address</FormLabel>
            <Input
              height={"100%"}
              backgroundColor={"black"}
              fontSize={[100, 75, 50, 24]}
              fontFamily={"arial"}
              textColor={"white"}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="#FF4E00"
              placeholderTextColor="white"
            />
          </FormControl>
          
          {error && (
            <Text
              color="red"
              fontSize={[100, 75, 50, 24]}
              fontWeight={"bold"}
              align={"center"}
            >
              {errorMsg}
            </Text>
          )}
          
          <Button
            height={"100%"}
            fontSize={[100, 75, 50, 24]}
            fontFamily={"Arial"}
            onClick={handleSaveEmail}
            bgColor="#FF4E00"
            color="black"
            borderColor="#FF4E00"
            borderRadius="5"
            width={["100%", "70%", "95%", "70%", "70%"]}
            mt={10}
          >
            Sign Up
          </Button>
        </VStack>

        <Modal isOpen={isModalOpen} maxH={"100hv"} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent maxW="100vw" maxH="100%">
            <ModalCloseButton size={"100%"} />
            <ModalBody>
              <Center>
                <Image
                  src={genie}
                  maxW={{ base: "20", md: "50%", lg: "30%" }}
                  mb={4}
                />
              </Center>
              <ModalHeader fontSize={[100, 75, 50, 24]} textAlign="center">
                <u>About</u>
              </ModalHeader>{" "}
              <Box
                maxHeight={["1000px", "900px", "700px", "300px", "200px"]}
                overflowY="auto"
                padding="0.5rem"
                whiteSpace="pre-line"
              >
                <Text fontSize={[100, 75, 50, 24]}>{aboutContent}</Text>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Center>
      
     
    </>
  );
}

export default App;
