"use client"
import { Grid } from "@mui/material"
import Login from "./Login"
import { Card } from "@mui/material"
import Register from "./Register"
import { Route, Routes, useLocation } from "react-router-dom"

const FloatingElement = ({ children, delay = 0, className = "" }) => (
  <div
    className={`${className}`}
    style={{
      animation: `float 8s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    {children}
  </div>
)

const ProfessionalBackground = () => (
  <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    {/* Subtle animated gradient overlay */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)",
        backgroundSize: "300% 300%",
        animation: "gradientShift 12s ease infinite",
      }}
    />

    {/* Professional floating elements */}
    <FloatingElement delay={0} className="absolute top-1/4 left-1/4">
      <div className="w-32 h-32 bg-blue-500/10 rounded-full backdrop-blur-sm border border-blue-200/30" />
    </FloatingElement>

    <FloatingElement delay={3} className="absolute top-1/3 right-1/4">
      <div className="w-24 h-24 bg-purple-500/10 rounded-2xl backdrop-blur-sm border border-purple-200/30" />
    </FloatingElement>

    <FloatingElement delay={6} className="absolute bottom-1/3 left-1/3">
      <div className="w-20 h-20 bg-indigo-500/10 rounded-full backdrop-blur-sm border border-indigo-200/30" />
    </FloatingElement>

    <style jsx>{`
      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-15px) rotate(2deg); }
        66% { transform: translateY(8px) rotate(-1deg); }
      }
    `}</style>
  </div>
)

const Authentication = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="min-h-screen">
      <Grid container sx={{ height: "auto" }}>
        {/* Left professional section */}
        <Grid
          item
          xs={false}
          sm={6}
          md={7}
          lg={8}
          sx={{
            display: { xs: "none", sm: "block" },
            height: "100vh",
            overflow: "hidden",
            position: { xs: "relative", md: "fixed" },
            left: 0,
            top: 0,
            bottom: 0,
            width: { md: "58.3333%", lg: "66.6667%" },
            zIndex: 1,
          }}
        >
          <ProfessionalBackground />

          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-8 max-w-2xl">
              <div
                className="mb-12"
                style={{
                  animation: "slideInUp 1.2s ease-out",
                }}
              >
                <h1 className="text-6xl font-bold mb-6 text-slate-800 leading-tight">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Thoughts
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  "Your thoughts shape your reality. Share them, connect with others, and inspire the world around you."
                </p>
              </div>

              <div
                className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
                style={{
                  animation: "slideInUp 1.2s ease-out 0.3s both",
                }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-700 mb-1">Connect</h3>
                  <p className="text-sm text-slate-500">Build meaningful relationships</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-700 mb-1">Share</h3>
                  <p className="text-sm text-slate-500">Express your thoughts freely</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-700 mb-1">Inspire</h3>
                  <p className="text-sm text-slate-500">Make a positive impact</p>
                </div>
              </div>
            </div>
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          lg={4}
          sx={{
            /* right panel takes normal flow so the page scrolls; add left margin to avoid overlap with fixed left panel */
            height: isRegisterPage ? "auto" : "100vh",
            minHeight: "100vh",
            ml: { md: "58.3333%", lg: "66.6667%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: isRegisterPage ? "flex-start" : "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
            px: { xs: 3, sm: 4, md: 6 },
            py: isRegisterPage ? { xs: 4, sm: 6 } : 0,
            position: "relative",
            overflow: "visible",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full"
              style={{ animation: "pulse 6s ease-in-out infinite" }}
            />
            <div
              className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-indigo-100/50 to-blue-100/50 rounded-full"
              style={{ animation: "pulse 6s ease-in-out infinite 3s" }}
            />
          </div>

          <Card
            sx={{
              p: { xs: 4, sm: 5 },
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)",
              width: "100%",
              maxWidth: { xs: 400, sm: 420 },
              borderRadius: 4,
              position: "relative",
              zIndex: 10,
              animation: "slideInUp 1s ease-out 0.2s both",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <div className="text-center mb-8">
              <div className="mb-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Thoughts
                </h1>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded-full" />
              </div>
              <p className="text-slate-600 font-medium">Join the conversation</p>
            </div>

            <div className="w-full">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </Card>
        </Grid>
      </Grid>

      <style jsx>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Authentication
