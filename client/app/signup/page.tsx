'use client'

import { Box, Button, Checkbox, CircularProgress, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CREATE_USER } from '../api/user/mutations';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation'
import ToastMessage from '../component/toast-message/ToastMessage';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const theme = createTheme();
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup
  .string()
  .matches(passwordRules, { message: "Please create a stronger password" })
  .required("Required"),
});

/* eslint-disable-next-line */
export interface SignupProps {}

export default function Signup(props: SignupProps)  {
  const initValue: FormValues = {
    email: "",
    firstName: "",
    lastName: "",
    password: ""
  }
  const router = useRouter();


  const [createUser, { data, error }] = useMutation(CREATE_USER);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formSubmit = async (values: FormValues, { setSubmitting, resetForm }:any) => {
    setSubmitting(true);

   await createUser({
      variables: {
        userId: "",
        email: values.email,
        password: values.password,
        lastName: values.lastName,
        firstName: values.firstName,
      }
    });

    if(data?.createUser?.email){
      resetForm();
      router.push("/login");
    }
    
    setSubmitting(false);
  }

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: SignupSchema,
    onSubmit: formSubmit,
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            borderRadius: "7px",
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            boxShadow:3,
            bgcolor: "#ffffff"
          }}
        >

          <ToastMessage 
            severity="success" 
            openFlag={data?.createUser?.email ? true : false } 
            message='Sign up successfully. Now redirect to login.'
          ></ToastMessage>

          <ToastMessage 
            severity="error" 
            openFlag={error ? true : false } 
            message='Problem while signup. Please try again'
          ></ToastMessage>

          <Box 
            component="div"
            sx={{bgcolor: "text.secondary" , width: "90%", textAlign:"center", paddingY:"15px", marginTop: "-60px", borderRadius: "5px"}}>
              
            <Typography component="h1" variant="h5" color={"#ffffff"}>
              Sign up
            </Typography>
          </Box>
          
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="false"
                    name="firstName"
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="false"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="false"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="false"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>
              {!formik.isSubmitting && <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>}
              {formik.isSubmitting && <CircularProgress disableShrink />}
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
