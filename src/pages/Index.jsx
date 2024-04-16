import { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Heading, Input, Textarea, VStack, useToast } from "@chakra-ui/react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const SUPABASE_URL = "https://mnwefvnykbgyhbdzpleh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud2Vmdm55a2JneWhiZHpwbGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzQ3MzQsImV4cCI6MjAyODg1MDczNH0.tnHysd1LqayzpQ1L-PImcvlkUmkNvocpMS7tS-hYZNg";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [text, setText] = useState("");
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("supabase.auth.token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("supabase.auth.token", data.access_token);
        setIsLoggedIn(true);
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("supabase.auth.token");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <Box p={4}>
        <Heading mb={4}>Login</Heading>
        <FormControl id="email" mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password" mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button leftIcon={<FaSignInAlt />} onClick={handleLogin}>
          Login
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading mb={4}>Text Editor</Heading>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} mb={4} />
      <VStack align="stretch">
        <Button onClick={handleLogout} leftIcon={<FaSignOutAlt />}>
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default Index;
