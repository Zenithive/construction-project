'use client'
import { Box, Button, Container, CssBaseline, Grid, Link, TextField, ThemeProvider, Typography,  createTheme } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../api/user/mutations';
import { useRouter } from 'next/navigation'
import ToastMessage from '../component/toast-message/ToastMessage';
import { useAppDispatch } from '../reducers/hook.redux';
import { addUser } from '../reducers/userReducer';

/* eslint-disable-next-line */
export interface LoginProps {}

interface FormValues {
  email: string;
  password: string;
}
const theme = createTheme();
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup
  .string()
  .matches(passwordRules, { message: "Please create a stronger password" })
  .required("Required"),
});

export default function Login(props: LoginProps) {
  const initValue: FormValues = {
    email: "",
    password: ""
  }
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loginUser, { data, error }] = useMutation(LOGIN_USER);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formSubmit = async (values: FormValues,{ setSubmitting, resetForm }:any) => {
    setSubmitting(true);
    const res = await loginUser({
      variables: {
        email: values.email,
        password: values.password,
      },
    });

    setTimeout(() => {

      const token:string|null = res.data?.loginUser?.token;
      if(token){
        resetForm();
        dispatch(addUser({token : token}));
        router.push("/dashboard");
      }
    },500);
    
    setSubmitting(false);
  }

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: LoginSchema,
    onSubmit: formSubmit,
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            borderRadius: "7px",
            boxShadow:3,
            bgcolor: "#ffffff"
          }}
        >
          <ToastMessage 
            severity="success" 
            openFlag={data?.loginUser?.email ? true : false } 
            message='Login successfully.'
          ></ToastMessage>

          <ToastMessage 
            severity="error" 
            openFlag={error ? true : false } 
            message='Problem while Login. Please try with diffetent credentials.'
          ></ToastMessage>
          
          <Box 
            component="div"
            sx={{bgcolor: "text.secondary" , width: "90%", textAlign:"center", paddingY:"15px", marginTop: "-60px", borderRadius: "5px"}}>
            <Typography component="h1" variant="h5" color={"#ffffff"}>
              Login
            </Typography>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signup" variant="body2">
                  Do not have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
