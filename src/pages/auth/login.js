import { useCallback, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      username: "huanluyenvien",
      password: "123456",
      submit: null,
    },
    validationSchema: Yup.object({
      username: Yup.string().max(255).required("Username is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signIn(values.username, values.password);
        router.push("/");
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Login | Football management system</title>
      </Head>
      <Grid
        container
        spacing={3}
        sx={{
          width: "100%",
          height: "100vh",
          margin: 0,
        }}
      >
        <Grid
          item
          md={6}
          xs={12}
          sx={{
            bgcolor: "#caffd1",
            color: "#fff",
          }}
          className="login-player"
        ></Grid>
        <Grid
          item
          md={6}
          xs={12}
          sx={{
            bgcolor: "#000000",
            width: "100%",
          }}
        >
          <form
            noValidate
            onSubmit={formik.handleSubmit}
            style={{
              backgroundColor: "#000000",
              paddingRight: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="formlogin"
          >
            <div className="login-logo"></div>
            <Typography variant="h4" sx={{ color: "#02d725", textAlign: "center", mb: 3, mt: 7 }}>
              Football Tournament Management System
            </Typography>
            <TextField
              sx={{ mb: 2, maxWidth: 300 }}
              error={!!(formik.touched.username && formik.errors.username)}
              fullWidth
              helperText={formik.touched.username && formik.errors.username}
              label="Username"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.username}
            />
            <TextField
              sx={{ maxWidth: 300 }}
              error={!!(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
            />
            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                fullWidth
                size="small"
                sx={{
                  mt: 3,
                  maxWidth: 200,
                  bgcolor: "#02d725",
                }}
                type="submit"
                variant="contained"
              >
                Login
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>
      {/* </div> */}
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
