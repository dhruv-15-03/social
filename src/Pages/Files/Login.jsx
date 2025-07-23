import React, { useEffect } from 'react';
import { TextField, Button } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction, getProfileAction } from "../../Redux/Auth/auth.actiion";
import { useNavigate } from "react-router-dom";

const initialValues = { username: "", password: "" };

const Login = () => {
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle successful login and navigate to home
    useEffect(() => {
        if (auth.jwt && !auth.loading) {
            // Get user profile after successful login
            dispatch(getProfileAction(auth.jwt));
            navigate('/');
        }
    }, [auth.jwt, auth.loading, dispatch, navigate]);

    const handleSubmit = (values) => {
        dispatch(loginUserAction({ data: values }));
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                // validationSchema={validationSchema}
            >
                <Form className="space-y-5 ">
                    <div className="space-y-5 ">
                        <div className="p-1 ">
                            <Field as={TextField} name="username" placeholder="Username" type="text" variant="outlined"
                                   fullWidth/>
                            <ErrorMessage name="username" component="div" className="text-red-500">
                            </ErrorMessage>
                        </div>
                        <div className="p-1 ">
                            <Field as={TextField} name="password" placeholder="Password" type="password" variant="outlined"
                                   fullWidth/>
                            <ErrorMessage name="password" component="div" className="text-red-500">
                            </ErrorMessage>
                        </div>
                        <p className="text-sm text-red-500">{auth.error != null && auth.error.response?.data?.message}</p>
                    </div>
                    <Button sx={{ padding: '0.8rem 0rem', backgroundColor: 'orange', height: '20%' }} fullWidth type="submit" 
                            variant="contained" color="primary" disabled={auth.loading}>
                        {auth.loading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>
            </Formik>
            <div className="flex items-center justify-center gap-2 pt-5">
                <p>If you don't have account</p>
                <Button onClick={() => navigate("/register")}>Register</Button>
            </div>
        </>
    );
};

export default Login;