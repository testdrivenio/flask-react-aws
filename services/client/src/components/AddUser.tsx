import React from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
} from "@chakra-ui/react";
import { FormErrorMessage } from "@chakra-ui/react";

interface UserObject {
  username: string;
  email: string;
  password?: string;
  created_date?: string;
}

interface AddUserProps {
  addUserToList: (user: UserObject) => void;
}

type FieldProps = {
  field: {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  };
};

const validationSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormValues = z.infer<typeof validationSchema>;

const AddUser: React.FC<AddUserProps> = ({ addUserToList }) => {
  const handleSubmit = async (
    values: FormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVICE_URL}/users`,
        values,
      );

      if (response.status === 201) {
        console.log(response.data.message);

        const newUser = {
          username: values.username,
          email: values.email,
          created_date: new Date().toISOString(),
        };

        addUserToList(newUser);
        resetForm();
      }
    } catch (error) {
      console.error("There was an error registering the user:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={4} maxW="1200px" mx="auto" mt={12}>
      <Box mb={6} textAlign="left">
        <Heading as="h2" size="xl" color="gray.700">
          Register a User
        </Heading>
      </Box>

      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        validate={(values) => {
          try {
            validationSchema.parse(values);
            return {};
          } catch (error) {
            return (error as z.ZodError).formErrors.fieldErrors;
          }
        }}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Box
              p={4}
              borderWidth={1}
              borderRadius="lg"
              boxShadow="lg"
              maxW="500px"
              textAlign="left"
            >
              <Field name="username">
                {({ field }: FieldProps) => (
                  <FormControl
                    isRequired
                    mb={6}
                    isInvalid={!!(errors.username && touched.username)}
                  >
                    <FormLabel fontSize="lg" htmlFor="input-username">
                      Username
                    </FormLabel>
                    <Input
                      {...field}
                      id="input-username"
                      placeholder="Enter a username"
                    />
                    {errors.username && touched.username && (
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>

              <Field name="email">
                {({ field }: FieldProps) => (
                  <FormControl
                    isRequired
                    mb={6}
                    isInvalid={!!(errors.email && touched.email)}
                  >
                    <FormLabel fontSize="lg" htmlFor="input-email">
                      Email
                    </FormLabel>
                    <Input
                      {...field}
                      id="input-email"
                      type="email"
                      placeholder="Enter an email address"
                    />
                    {errors.email && touched.email && (
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field }: FieldProps) => (
                  <FormControl
                    isRequired
                    mb={6}
                    isInvalid={!!(errors.password && touched.password)}
                  >
                    <FormLabel fontSize="lg" htmlFor="input-password">
                      Password
                    </FormLabel>
                    <Input
                      {...field}
                      id="input-password"
                      type="password"
                      placeholder="Enter a password"
                    />
                    {errors.password && touched.password && (
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>

              <Button
                type="submit"
                colorScheme="green"
                bg="green.400"
                size="lg"
                width="full"
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddUser;
