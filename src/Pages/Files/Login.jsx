import React, { useState } from 'react';
import { TextField, Button, Alert, Box, Fade, CircularProgress } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction } from "../../Redux/Auth/auth.actiion";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { logger } from '../../utils/productionLogger';

const validationSchema = Yup.object({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
});

const initialValues = { username: "", password: "" };

const Login = () => {
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isRateLimited, setIsRateLimited] = useState(false);

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        // Rate limiting protection
        if (loginAttempts >= 5) {
            setIsRateLimited(true);
            logger.auth.warn('Too many login attempts, rate limiting triggered');
            setTimeout(() => {
                setIsRateLimited(false);
                setLoginAttempts(0);
            }, 300000); // 5 minutes
            setSubmitting(false);
            return;
        }

        try {
            logger.auth.login('Login attempt initiated', { username: values.username });
            await dispatch(loginUserAction({ data: values }));
            logger.auth.login('Login successful');
            setLoginAttempts(0); // Reset on success
        } catch (error) {
            logger.auth.error('Login failed', { 
                username: values.username, 
                error: error.message,
                attempt: loginAttempts + 1
            });
            
            setLoginAttempts(prev => prev + 1);
            
            // Handle specific error types
            if (error.response?.status === 401) {
                setFieldError('password', 'Invalid username or password');
            } else if (error.response?.status === 429) {
                setIsRateLimited(true);
            }
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
                validationSchema={validationSchema}
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
                            
                            {/* Enhanced error display with better UX */}
                            {auth.error && (
                                <Fade in={!!auth.error} timeout={300}>
                                    <Alert 
                                        severity="error" 
                                        sx={{ 
                                            mt: 2, 
                                            borderRadius: 2,
                                            '& .MuiAlert-message': {
                                                width: '100%'
                                            }
                                        }}
                                    >
                                        {auth.error.response?.data?.message || 
                                         auth.error.message || 
                                         'Login failed. Please check your credentials and try again.'}
                                    </Alert>
                                </Fade>
                            )}

                            {/* Rate limiting warning */}
                            {isRateLimited && (
                                <Fade in={isRateLimited} timeout={300}>
                                    <Alert 
                                        severity="warning" 
                                        sx={{ mt: 2, borderRadius: 2 }}
                                    >
                                        Too many login attempts. Please wait 5 minutes before trying again.
                                    </Alert>
                                </Fade>
                            )}

                            {/* Login attempts indicator */}
                            {loginAttempts > 0 && !isRateLimited && (
                                <Box sx={{ mt: 1, textAlign: 'center' }}>
                                    <Box 
                                        component="span" 
                                        sx={{ 
                                            fontSize: '12px', 
                                            color: loginAttempts >= 3 ? 'error.main' : 'warning.main',
                                            fontWeight: 500
                                        }}
                                    >
                                        {loginAttempts >= 3 
                                            ? `⚠️ ${5 - loginAttempts} attempts remaining`
                                            : `Attempt ${loginAttempts} of 5`
                                        }
                                    </Box>
                                </Box>
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
                                position: 'relative',
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
                            disabled={isSubmitting || auth.loading || isRateLimited}
                        >
                            {isSubmitting || auth.loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} color="inherit" />
                                    <span>Signing in...</span>
                                </Box>
                            ) : isRateLimited ? (
                                'Please wait...'
                            ) : (
                                'Sign In'
                            )}
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