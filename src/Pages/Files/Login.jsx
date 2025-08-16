"use client"

import { useState } from "react"
import { TextField, Button, Alert, Box, Fade, CircularProgress, IconButton, InputAdornment } from "@mui/material"
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { ErrorMessage, Field, Form, Formik } from "formik"
import { useDispatch, useSelector } from "react-redux"
import { loginUserAction } from "../../Redux/Auth/auth.actiion"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import { logger } from "../../utils/productionLogger"

const validationSchema = Yup.object({
  username: Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

const initialValues = { username: "", password: "" }

const Login = () => {
  const { auth } = useSelector((store) => store)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    // Rate limiting protection
    if (loginAttempts >= 5) {
      setIsRateLimited(true)
      logger.auth.warn("Too many login attempts, rate limiting triggered")
      setTimeout(() => {
        setIsRateLimited(false)
        setLoginAttempts(0)
      }, 300000) // 5 minutes
      setSubmitting(false)
      return
    }

    try {
      logger.auth.login("Login attempt initiated", { username: values.username })
      await dispatch(loginUserAction({ data: values }))
      logger.auth.login("Login successful")
      setLoginAttempts(0) // Reset on success
    } catch (error) {
      logger.auth.error("Login failed", {
        username: values.username,
        error: error.message,
        attempt: loginAttempts + 1,
      })

      setLoginAttempts((prev) => prev + 1)

      // Handle specific error types
      if (error.response?.status === 401) {
        setFieldError("password", "Invalid username or password")
      } else if (error.response?.status === 429) {
        setIsRateLimited(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 3,
        mt: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
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
          Welcome Back
        </h2>
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          Sign in to continue your journey
        </p>
      </Box>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div className="space-y-5">
              <div style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}>
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
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-2 font-medium" />
              </div>

              <div style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}>
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

              {/* Enhanced error display with better UX */}
              {auth.error && (
                <Fade in={!!auth.error} timeout={300}>
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      "& .MuiAlert-message": {
                        width: "100%",
                      },
                    }}
                  >
                    {auth.error.response?.data?.message ||
                      auth.error.message ||
                      "Login failed. Please check your credentials and try again."}
                  </Alert>
                </Fade>
              )}

              {/* Rate limiting warning */}
              {isRateLimited && (
                <Fade in={isRateLimited} timeout={300}>
                  <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                    Too many login attempts. Please wait 5 minutes before trying again.
                  </Alert>
                </Fade>
              )}

              {/* Login attempts indicator */}
              {loginAttempts > 0 && !isRateLimited && (
                <Box sx={{ mt: 1, textAlign: "center" }}>
                  <Box
                    component="span"
                    sx={{
                      fontSize: "12px",
                      color: loginAttempts >= 3 ? "error.main" : "warning.main",
                      fontWeight: 500,
                    }}
                  >
                    {loginAttempts >= 3 ? `⚠️ ${5 - loginAttempts} attempts remaining` : `Attempt ${loginAttempts} of 5`}
                  </Box>
                </Box>
              )}
            </div>

            <div style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}>
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
                disabled={isSubmitting || auth.loading || isRateLimited}
              >
                {isSubmitting || auth.loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Signing in...</span>
                  </Box>
                ) : isRateLimited ? (
                  "Please wait..."
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <Box
        sx={{ textAlign: "center", mt: 4, pt: 3, borderTop: "1px solid #e2e8f0" }}
        style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}
      >
        <p style={{ margin: "0 0 12px 0", color: "#64748b", fontSize: "15px", fontWeight: 500 }}>
          Don't have an account?
        </p>
        <Button
          onClick={() => navigate("/register")}
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
          Create Account
        </Button>
      </Box>

      <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </Box>
  )
}

export default Login
