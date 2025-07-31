import React, { useEffect } from 'react';
import { FormControlLabel, Radio, RadioGroup, TextField, Button, Alert, Box } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { registerUserAction, getProfileAction } from "../../Redux/Auth/auth.actiion";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    userName: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    gender: Yup.string().required('Gender is required')
});

const initialValues = { name: "", email: "", userName: "", password: "", confirmPassword: "", gender: "" }

const Register = () => {
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Enhanced authentication check
    useEffect(() => {
        if (auth.jwt && auth.user && !auth.loading) {
            navigate('/', { replace: true });
            return;
        }

        if (auth.jwt && !auth.user && !auth.loading) {
            dispatch(getProfileAction(auth.jwt));
        }
    }, [auth.jwt, auth.user, auth.loading, dispatch, navigate]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await dispatch(registerUserAction({ data: values }));
        } catch (error) {
            // Error handling is done by Redux action
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            {/* Register Header */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <h2 style={{ margin: 0, color: '#333', fontWeight: 600, fontSize: '22px' }}>
                    Create Account
                </h2>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '13px' }}>
                    Join us today
                </p>
            </Box>

            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
            >
                {({ isSubmitting, setFieldValue, values, touched, errors }) => (
                    <Form className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <Field 
                                    as={TextField}
                                    name="name"
                                    label="Full Name"
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
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <Field 
                                    as={TextField}
                                    name="email"
                                    label="Email Address"
                                    type="email"
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
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <Field 
                                    as={TextField}
                                    name="userName"
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
                                <ErrorMessage name="userName" component="div" className="text-red-500 text-sm mt-1" />
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

                            <div>
                                <Field 
                                    as={TextField}
                                    name="confirmPassword"
                                    label="Confirm Password"
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
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Gender Selection */}
                            <Box>
                                <p style={{ margin: '0 0 8px 0', color: '#333', fontSize: '14px', fontWeight: 500 }}>
                                    Gender
                                </p>
                                <RadioGroup
                                    row
                                    name="gender"
                                    value={values.gender}
                                    onChange={e => setFieldValue('gender', e.target.value)}
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '14px',
                                        },
                                        '& .MuiRadio-root.Mui-checked': {
                                            color: '#ff6b35',
                                        },
                                        '& .MuiRadio-root': {
                                            padding: '6px',
                                        }
                                    }}
                                >
                                    <FormControlLabel 
                                        value="female" 
                                        control={<Radio />} 
                                        label="Female" 
                                        disabled={isSubmitting || auth.loading}
                                    />
                                    <FormControlLabel 
                                        value="male" 
                                        control={<Radio />} 
                                        label="Male" 
                                        disabled={isSubmitting || auth.loading}
                                    />
                                    <FormControlLabel 
                                        value="other" 
                                        control={<Radio />} 
                                        label="Other" 
                                        disabled={isSubmitting || auth.loading}
                                    />
                                </RadioGroup>
                                {touched.gender && errors.gender && (
                                    <div className="text-red-500 text-sm mt-1">{errors.gender}</div>
                                )}
                            </Box>
                            
                            {/* Enhanced error display */}
                            {auth.error && (
                                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                                    {auth.error.response?.data?.message || 
                                     auth.error.message || 
                                     'Registration failed. Please try again.'}
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
                            {isSubmitting || auth.loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </Form>
                )}
            </Formik>
            
            <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                    Already have an account?
                </p>
                <Button 
                    onClick={() => navigate("/login")}
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
                    Sign In
                </Button>
            </Box>
        </div>
    );
}

export default Register;