import React, { useEffect } from 'react';
import { TextField, Button, Alert, Box } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction, getProfileAction } from "../../Redux/Auth/auth.actiion";
import { useNavigate } from "react-router-dom";

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
        <Box sx={{ 
            maxWidth: 400, 
            mx: 'auto', 
            p: 3,
            mt: 4,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: 'background.paper'
        }}>
            
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <h2 style={{ margin: 0, color: '#333', fontWeight: 600 }}>
                    Welcome Back
                </h2>
                <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
                    Sign in to your account
                </p>
            </Box>

            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <Field 
                                    as={TextField}
                                    name="username"
                                    label="Username"
                                    type="text"
                                    variant="filled"
                                    fullWidth
                                    disabled={isSubmitting || auth.loading}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                    sx={{
                                        '& .MuiFilledInput-root': {
                                            borderRadius: '8px',
                                            backgroundColor: '#f8fafc',
                                            border: '1.5px solid #e0e0e0',
                                            transition: 'border-color 0.2s',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                backgroundColor: '#f3f3f3',
                                                borderColor: '#ff6b35',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#fff',
                                                borderColor: '#ff6b35',
                                                boxShadow: '0 0 0 3px rgba(255,107,53,0.08)',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#666',
                                            fontWeight: 500,
                                            '&.Mui-focused': {
                                                color: '#ff6b35',
                                            },
                                        },
                                    }}
                                />
                                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                                <Field 
                                    as={TextField}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    variant="filled"
                                    fullWidth
                                    disabled={isSubmitting || auth.loading}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                    sx={{
                                        '& .MuiFilledInput-root': {
                                            borderRadius: '8px',
                                            backgroundColor: '#f8fafc',
                                            border: '1.5px solid #e0e0e0',
                                            transition: 'border-color 0.2s',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                backgroundColor: '#f3f3f3',
                                                borderColor: '#ff6b35',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#fff',
                                                borderColor: '#ff6b35',
                                                boxShadow: '0 0 0 3px rgba(255,107,53,0.08)',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#666',
                                            fontWeight: 500,
                                            '&.Mui-focused': {
                                                color: '#ff6b35',
                                            },
                                        },
                                    }}
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            
                            {/* Enhanced error display */}
                            {auth.error && (
                                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                                    {auth.error.response?.data?.message || 
                                     auth.error.message || 
                                     'Login failed. Please try again.'}
                                </Alert>
                            )}
                        </div>
                        
                        <Button 
                            sx={{ 
                                padding: '12px 0', 
                                backgroundColor: '#ff6b35',
                                fontSize: '16px',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: '#e55a2b'
                                },
                                '&:disabled': {
                                    backgroundColor: 'grey.300',
                                    color: 'grey.500'
                                }
                            }} 
                            fullWidth 
                            type="submit" 
                            variant="contained"
                            disabled={isSubmitting || auth.loading}
                        >
                            {isSubmitting || auth.loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Form>
                )}
            </Formik>
            
            <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    Don't have an account?
                </p>
                <Button 
                    onClick={() => navigate("/register")}
                    disabled={auth.loading}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#ff6b35',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 107, 53, 0.1)'
                        }
                    }}
                >
                    Create Account
                </Button>
            </Box>
        </Box>
    );
};

export default Login;