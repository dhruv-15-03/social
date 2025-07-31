import React from "react";
import { Grid } from "@mui/material";
import img from "../../img/Screenshot 2024-07-21 163336.png"
import i2 from "../../img/pngtree-background-frame-geometric-with-neon-glow-and-bright-colors-can-be-image_339492.jpg"
import Login from "./Login";
import {Card} from "@mui/material";
import Register from "./Register";
import {Route, Routes} from "react-router-dom";

const Authentication = () => {
    return (
        <div>
            <Grid container sx={{ minHeight: '100vh' }}>
                {/* Left image section: hide on xs, show on sm+ */}
                <Grid
                    item
                    xs={false}
                    sm={6}
                    md={7}
                    lg={8}
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        height: { sm: '100vh', xs: 0 },
                        overflow: 'hidden',
                    }}
                >
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img
                        src={img}
                        alt="Connecting Lives"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Grid>
                {/* Right form section: full width on xs, 4 cols on lg */}
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={5}
                    lg={4}
                    sx={{
                        height: { xs: 'auto', sm: '100vh' },
                        overflow: { xs: 'visible', sm: 'hidden' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: `url(${i2})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        px: { xs: 2, sm: 6, md: 8 },
                        py: { xs: 2, sm: 8 },
                    }}
                >
                    <Card
                        className="card"
                        sx={{
                            p: { xs: 2, sm: 4 },
                            bgcolor: 'purple.500',
                            border: 4,
                            borderColor: 'indigo.700',
                            width: '100%',
                            maxWidth: 400,
                            mx: 'auto',
                            my: { xs: 2, sm: 4 },
                            // Enable vertical scroll for desktop if content overflows
                            maxHeight: { sm: '90vh', xs: 'none' },
                            overflowY: { sm: 'auto', xs: 'visible' },
                        }}
                    >
                        <div className="flex flex-col items-center mb-5 space-y-1">
                            <h1 className="font-serif font-bold text-center underline logo">Thoughts</h1>
                            <p className="text-center text-sm w-full">A Space for Your Thoughts and opinions</p>
                        </div>
                        <Routes>
                            <Route path='/' element={<Login />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/register' element={<Register />} />
                        </Routes>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};
export default Authentication;