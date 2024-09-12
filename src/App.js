

import Authentication from "./Pages/Files/Authentication";
import {Route, Routes} from "react-router-dom";

import React, { useEffect } from "react";
import HomePage from "./Pages/Home/HomePage";
import Messages from "./Pages/Messages/Messages";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "./Redux/Auth/auth.actiion";

function App() {
const {auth}=useSelector(store=>store);
const dispatch=useDispatch();
const jwt=localStorage.getItem("jwt");
useEffect(()=>{
    dispatch(getProfileAction(jwt))
},[jwt])
  return (

      <div className="">
          <Routes>
              <Route path='/*' element={auth.user?<HomePage/>:<Authentication/>}></Route>
              <Route path='/messages' element={<Messages/>}></Route>
              <Route path='/auth' element={<Authentication/>}></Route>
          </Routes>
      </div>
);
}

export default App;
