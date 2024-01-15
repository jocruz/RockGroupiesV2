import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import React from "react";

interface SignUpProps {
  setEmail: (value: string) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  handleLogin: () => Promise<void>;
}

const Signup: React.FC<SignUpProps> = ({
  setEmail,
  setFirstName,
  setLastName,
  setPhoneNumber,
  handleLogin,
}) => {
  return (
    <div>
      <VStack
        spacing={4}
        align="stretch"
        maxWidth={"90vw"}
        width={"full"}
        mx="auto"
      >
        <Text
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "2xl", md: "3xl" }} // Responsive font size
          textAlign="center"
          color="green.600" // Example color, choose what fits your design
          letterSpacing="wider" // Adjust letter spacing
          my={4} // Margin for top and bottom
          p={2} // Padding
        >
          Sign Up for the Rock Groupies
        </Text>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          style={{
            width: 500,
            maxWidth: "90vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <FormControl id="email">
            <FormLabel textAlign={"center"}>Email address</FormLabel>
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              placeholder="Email Address"
            />
          </FormControl>

          <FormControl id="text">
            <FormLabel textAlign={"center"}>First Name</FormLabel>
            <Input
              type="email"
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.inputField}
              placeholder="First Name"
            />
          </FormControl>
          <FormControl id="text">
            <FormLabel textAlign={"center"}>Last Name</FormLabel>
            <Input
              type="email"
              onChange={(e) => setLastName(e.target.value)}
              className={styles.inputField}
              placeholder="Last Name"
            />
          </FormControl>

          <FormControl id="text">
            <FormLabel textAlign={"center"}> Phone Number </FormLabel>
            <Input
              type="text"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.inputField}
              placeholder="123-456-7890"
            />
          </FormControl>

          <Button
            fontFamily="heading"
            mt={8}
            w="full"
            bgGradient="linear(to-r, green.400, blue.400)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, blue.400, green.400)",
              boxShadow: "xl",
            }}
          >
            Submit
          </Button>
        </form>
      </VStack>
    </div>
  );
};

export default Signup;
