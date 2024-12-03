import React from "react";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { Navigate } from "react-router-dom";

const validationSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type FormValues = z.infer<typeof validationSchema>;

interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  isAuthenticated: () => boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isAuthenticated }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return (
    <Box maxWidth="400px" margin="100px auto 0">
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Log In
      </Heading>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(values);
          resetForm();
          setSubmitting(false);
        }}
        validate={(values) => {
          try {
            validationSchema.parse(values);
            return {};
          } catch (error) {
            return (error as z.ZodError).formErrors.fieldErrors;
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <VStack spacing={4}>
              <Field name="email">
                {({ field }) => (
                  <FormControl isInvalid={!!(errors.email && touched.email)}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Enter an email address"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field }) => (
                  <FormControl
                    isInvalid={!!(errors.password && touched.password)}
                  >
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Enter a password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSubmitting}
                bg="green.400"
                _hover={{ bg: "green.500" }}
              >
                Log In
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;
