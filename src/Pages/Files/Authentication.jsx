import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import img from "../../img/Screenshot 2024-07-21 163336.png"
import i2 from "../../img/pngtree-background-frame-geometric-with-neon-glow-and-bright-colors-can-be-image_339492.jpg"
// import Card from 'react-bootstrap/Card';
import Login from "./Login";
import {Card} from "@mui/material";
import Register from "./Register";
import {Route, Routes, useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";

const Authentication=()=>{
    const { auth } = useSelector(store => store);
    const navigate = useNavigate();

    // Redirect to home if user becomes authenticated
    useEffect(() => {
        if (auth.jwt && auth.user && !auth.loading) {
            navigate('/', { replace: true });
        }
    }, [auth.jwt, auth.user, auth.loading, navigate]);

    return(
        <div >
            <Grid container>
                <Grid className="h-screen overflow-hidden" item xs={8}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img className="w-full h-full " src={img} alt='Connecting Lives' />
                </Grid>
                <Grid item xs={4} sx={{ height: '100vh', overflow: 'hidden' }}>
                    <div 
                        className="h-full w-full px-20 bg-scroll bg-center overflow-y-auto py-8" 
                        style={{
                            backgroundImage: `url(${i2})`,
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100vh'
                        }}
                    >
                        <div className="flex-1 flex items-center justify-center">
                            <Card className="p-8 bg-purple-500 border-4 border-current border-indigo-700 card w-full max-w-md mx-auto my-4">
                                <div className='flex flex-col items-center mb-5 space-y-1 '>
                                    <h1 className='font-serif font-bold text-center underline logo'>Thoughts</h1>
                                    <p className="text-center text-sm w-[70&]"> A Space for Your Thoughts and opinions</p>
                                </div>
                                    <Routes>
                                        <Route path='/' element={<Login/>}></Route>
                                        <Route path='/login' element={<Login/>}></Route>
                                        <Route path='/register' element={<Register/>}></Route>
                                    </Routes>
                            </Card>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}
export default Authentication