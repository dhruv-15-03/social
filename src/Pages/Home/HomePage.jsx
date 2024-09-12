import React, { useEffect } from "react";
import {Grid} from "@mui/material";
import {Route, Routes, useLocation} from "react-router-dom";
import MiddlePart from "../../Components/MiddlePart/MiddlePart";
import Reels from "../../Components/MiddlePart/Reels/Reels";
import CreateReels from "../../Components/MiddlePart/Reels/CreateReels";
import Profile from "../Profile/Profile";
import HomeRight from "../../Components/HomeRight/HomeRight";
import Sidebar from "../../Components/SideBar/Sidebar";
import { useDispatch } from "react-redux";
import { getProfileAction } from "../../Redux/Auth/auth.actiion";

const HomePage=()=>{
    const dispatch=useDispatch()
    const location=useLocation();
    const jwt=localStorage.getItem("jwt");
    
   

    useEffect(()=>{
        dispatch(getProfileAction(jwt))
},[])
    return(
        <div className="px-20">
            <Grid container spacing={0}>
                <Grid item xs={0} lg={3}>
                    <div className="sticky top-0">
                        <Sidebar/>
                    </div>
                </Grid>
                <Grid
                    lg={location.pathname==="/"?6:9}
                    item className="flex justify-center px-5" xs={12}>
                    <Routes>
                        <Route path="/" element={<MiddlePart/>}>
                        </Route>
                        <Route path="/reels" element={<Reels/>}>
                        </Route>
                        <Route path="/create-reels" element={<CreateReels open={true}/>}>
                        </Route>
                        <Route path="/profile/:userId" element={<Profile />}>
                        </Route>
                    </Routes>
                </Grid>
                {location.pathname==="/"?<Grid item lg={3} className="relative">
                    <div className="sticky top-0 w-full">
                        <HomeRight/>
                    </div>
                </Grid>:""}
            </Grid>
        </div>
    )
}
export default HomePage