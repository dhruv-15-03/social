import React from "react";
import { Grid } from "@mui/material";
import img from "../../img/Screenshot 2024-07-21 163336.png"
import i2 from "../../img/pngtree-background-frame-geometric-with-neon-glow-and-bright-colors-can-be-image_339492.jpg"
// import Card from 'react-bootstrap/Card';
import Login from "./Login";
import {Card} from "@mui/material";
import Register from "./Register";
import {Route, Routes} from "react-router-dom";
const Authentication=()=>{

    return(
        <div >
            <Grid container>
                <Grid className="h-screen overflow-hidden" item xs={8}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img className="w-full h-full " src={img} alt='Connecting Lives' />
                </Grid>
                <Grid item xs={4} className="sticky flex justify-center">


                    <div className="flex flex-col justify-center h-full px-20 bg-scroll bg-center " style={{backgroundImage: `url(${i2})`}}>

                        <Card className="p-8 bg-purple-500 border-4 border-current border-indigo-700 card">
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
                </Grid>
            </Grid>
        </div>
    )
}
export default Authentication