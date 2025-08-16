"use client"

import { useEffect, useState } from "react"
import { FormControlLabel, Radio, RadioGroup, TextField, Button, Alert, Box, IconButton, InputAdornment } from "@mui/material"
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { ErrorMessage, Field, Form, Formik } from "formik"
import { useDispatch, useSelector } from "react-redux"
import { registerUserAction, getProfileAction } from "../../Redux/Auth/auth.actiion"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  gender: Yup.string().required("Gender is required"),
})

const initialValues = { name: "", email: "", userName: "", password: "", confirmPassword: "", gender: "" }

const Register = () => {
  const { auth } = useSelector((store) => store)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Enhanced authentication check
  useEffect(() => {
    if (auth.jwt && auth.user && !auth.loading) {
      navigate("/", { replace: true })
      return
    }

    if (auth.jwt && !auth.user && !auth.loading) {
      dispatch(getProfileAction(auth.jwt))
    }
  }, [auth.jwt, auth.user, auth.loading, dispatch, navigate])

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(registerUserAction({ data: values }))
    } catch (error) {
      // Error handling is done by Redux action
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Box sx={{ textAlign: "center", mb: 4 }} style={{ animation: "fadeInUp 0.6s ease-out" }}>
        <h2
          style={{
            margin: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          Create Account
        </h2>
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          Join our community today
        </p>
      </Box>

      <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema}>
        {({ isSubmitting, setFieldValue, values, touched, errors }) => (
          <Form className="space-y-4">
            <div className="space-y-4">
              <div style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}>
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
                    "& .MuiFilledInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      border: "2px solid #e2e8f0",
                      transition: "all 0.3s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                        borderColor: "#667eea",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(102,126,234,0.15)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        borderColor: "#667eea",
                        boxShadow: "0 0 0 4px rgba(102,126,234,0.1)",
                        transform: "translateY(-1px)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontWeight: 600,
                      "&.Mui-focused": {
                        color: "#667eea",
                      },
                    },
                  }}
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-2 font-medium" />
              </div>

              <div style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}>
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
                    "& .MuiFilledInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      border: "2px solid #e2e8f0",
                      transition: "all 0.3s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                        borderColor: "#667eea",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(102,126,234,0.15)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        borderColor: "#667eea",
                        boxShadow: "0 0 0 4px rgba(102,126,234,0.1)",
                        transform: "translateY(-1px)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontWeight: 600,
                      "&.Mui-focused": {
                        color: "#667eea",
                      },
                    },
                  }}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-2 font-medium" />
              </div>

              <div style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}>
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
                    "& .MuiFilledInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      border: "2px solid #e2e8f0",
                      transition: "all 0.3s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                        borderColor: "#667eea",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(102,126,234,0.15)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        borderColor: "#667eea",
                        boxShadow: "0 0 0 4px rgba(102,126,234,0.1)",
                        transform: "translateY(-1px)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontWeight: 600,
                      "&.Mui-focused": {
                        color: "#667eea",
                      },
                    },
                  }}
                />
                <ErrorMessage name="userName" component="div" className="text-red-500 text-sm mt-2 font-medium" />
              </div>

              <div style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}>
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="filled"
                  fullWidth
                  disabled={isSubmitting || auth.loading}
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword((s) => !s)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiFilledInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      border: "2px solid #e2e8f0",
                      transition: "all 0.3s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                        borderColor: "#667eea",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(102,126,234,0.15)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        borderColor: "#667eea",
                        boxShadow: "0 0 0 4px rgba(102,126,234,0.1)",
                        transform: "translateY(-1px)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontWeight: 600,
                      "&.Mui-focused": {
                        color: "#667eea",
                      },
                    },
                  }}
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-2 font-medium" />
              </div>

              <div style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}>
                <Field
                  as={TextField}
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  variant="filled"
                  fullWidth
                  disabled={isSubmitting || auth.loading}
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowConfirmPassword((s) => !s)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiFilledInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      border: "2px solid #e2e8f0",
                      transition: "all 0.3s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                        borderColor: "#667eea",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(102,126,234,0.15)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#fff",
                        borderColor: "#667eea",
                        boxShadow: "0 0 0 4px rgba(102,126,234,0.1)",
                        transform: "translateY(-1px)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                      fontWeight: 600,
                      "&.Mui-focused": {
                        color: "#667eea",
                      },
                    },
                  }}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-2 font-medium"
                />
              </div>

              <Box style={{ animation: "fadeInUp 0.6s ease-out 0.6s both" }}>
                <p style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "15px", fontWeight: 600 }}>Gender</p>
                <RadioGroup
                  row
                  name="gender"
                  value={values.gender}
                  onChange={(e) => setFieldValue("gender", e.target.value)}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#4b5563",
                    },
                    "& .MuiRadio-root.Mui-checked": {
                      color: "#667eea",
                    },
                    "& .MuiRadio-root": {
                      padding: "8px",
                      "&:hover": {
                        backgroundColor: "rgba(102,126,234,0.1)",
                      },
                    },
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
                  <div className="text-red-500 text-sm mt-2 font-medium">{errors.gender}</div>
                )}
              </Box>

              {/* Enhanced error display */}
              {auth.error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {auth.error.response?.data?.message || auth.error.message || "Registration failed. Please try again."}
                </Alert>
              )}
            </div>

            <div style={{ animation: "fadeInUp 0.6s ease-out 0.7s both" }}>
              <Button
                sx={{
                  padding: "14px 0",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontSize: "16px",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(102,126,234,0.6)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                  "&:disabled": {
                    background: "linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)",
                    color: "#718096",
                    transform: "none",
                    boxShadow: "none",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transition: "left 0.5s",
                  },
                  "&:hover::before": {
                    left: "100%",
                  },
                }}
                fullWidth
                type="submit"
                variant="contained"
                disabled={isSubmitting || auth.loading}
              >
                {isSubmitting || auth.loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <Box
        sx={{ textAlign: "center", mt: 4, pt: 3, borderTop: "1px solid #e2e8f0" }}
        style={{ animation: "fadeInUp 0.6s ease-out 0.8s both" }}
      >
        <p style={{ margin: "0 0 12px 0", color: "#64748b", fontSize: "15px", fontWeight: 500 }}>
          Already have an account?
        </p>
        <Button
          onClick={() => navigate("/login")}
          disabled={auth.loading}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: "15px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            padding: "8px 16px",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "rgba(102,126,234,0.1)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Sign In
        </Button>
      </Box>

      <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  )
}

export default Register
