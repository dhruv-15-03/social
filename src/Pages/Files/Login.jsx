import React, { useEffect } from 'react';
import { TextField, Button, Alert, Box } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction, getProfileAction } from "../../Redux/Auth/auth.actiion";
import { useNavigate } from "react-router-dom";
import envConfig from "../../config/environment";

const initialValues = { username: "", password: "" };

const Login = () => {
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Enhanced authentication check with better logic
    useEffect(() => {
        // Check if user is already authenticated and has profile data
        if (auth.jwt && auth.user && !auth.loading) {
            console.log('✅ User authenticated, redirecting to home');
            navigate('/', { replace: true });
            return;
        }

        // If we have JWT but no user data, try to fetch profile
        if (auth.jwt && !auth.user && !auth.loading) {
            console.log('🔄 JWT found, fetching user profile');
            dispatch(getProfileAction(auth.jwt));
        }
    }, [auth.jwt, auth.user, auth.loading, dispatch, navigate]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await dispatch(loginUserAction({ data: values }));
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
            {/* Show authentication status for debugging */}
            {envConfig.app.isDevelopment && (
                <Box sx={{ mb: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                    <p style={{ fontSize: '12px', margin: 0 }}>
                        Debug: JWT={auth.jwt ? '✅' : '❌'} | 
                        User={auth.user ? '✅' : '❌'} | 
                        Loading={auth.loading ? '🔄' : '✅'}
                    </p>
                </Box>
            )}

            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-5">
                        <div className="space-y-5">
                            <div className="p-1">
                                <Field 
                                    as={TextField} 
                                    name="username" 
                                    placeholder="Username" 
                                    type="text" 
                                    variant="outlined"
                                    fullWidth
                                    disabled={isSubmitting || auth.loading}
                                />
                                <ErrorMessage name="username" component="div" className="text-red-500" />
                            </div>
                            <div className="p-1">
                                <Field 
                                    as={TextField} 
                                    name="password" 
                                    placeholder="Password" 
                                    type="password" 
                                    variant="outlined"
                                    fullWidth
                                    disabled={isSubmitting || auth.loading}
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500" />
                            </div>
                            
                            {/* Enhanced error display */}
                            {auth.error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {auth.error.response?.data?.message || 
                                     auth.error.message || 
                                     'Login failed. Please try again.'}
                                </Alert>
                            )}
                        </div>
                        
                        <Button 
                            sx={{ 
                                padding: '0.8rem 0rem', 
                                backgroundColor: 'orange', 
                                height: '20%',
                                '&:disabled': {
                                    backgroundColor: 'grey.300'
                                }
                            }} 
                            fullWidth 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            disabled={isSubmitting || auth.loading}
                        >
                            {isSubmitting || auth.loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                )}
            </Formik>
            
            <div className="flex items-center justify-center gap-2 pt-5">
                <p>If you don't have account</p>
                <Button 
                    onClick={() => navigate("/register")}
                    disabled={auth.loading}
                >
                    Register
                </Button>
            </div>
        </Box>
    );
};

export default Login;