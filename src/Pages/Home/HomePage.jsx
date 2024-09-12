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
        <div className="px-5 lg:px-20">
    <Grid container spacing={2}>
        <Grid item xs={0} sm={0} md={0} lg={3}>
            <div className="sticky top-0">
                <Sidebar />
            </div>
        </Grid>

        <Grid
            item
            xs={12} 
            sm={12} 
        md={12} 
            lg={location.pathname === "/" ? 6 : 9} 
            className="flex justify-center px-5"
        >
            <Routes>
                <Route path="/" element={<MiddlePart />} />
                <Route path="/reels" element={<Reels />} />
                <Route path="/create-reels" element={<CreateReels open={true} />} />
                <Route path="/profile/:userId" element={<Profile />} />
            </Routes>
        </Grid>

        {location.pathname === "/" && (
            <Grid item xs={0} sm={0} md={0} lg={3} className="relative">
                <div className="sticky top-0 w-full">
                    <HomeRight />
                </div>
            </Grid>
        )}
    </Grid>
</div>

    )
}
export default HomePage