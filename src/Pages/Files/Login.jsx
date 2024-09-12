// import React from 'react';
import { TextField } from "@mui/material";
import {ErrorMessage, Field, Form, Formik} from "formik";
import React,{useState} from "react";
import * as Yup from "yup"
import {Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {loginUserAction} from "../../Redux/Auth/auth.actiion"
import {date} from "yup";
import { useNavigate } from "react-router-dom";

const initialValues={username:"",password:""}
const validationSchema={email:Yup.string().required("Username is Required"),
password:Yup.string().min(6,"Password must be at least 6 Characters Long").required("Password is required")}

const Login=()=> {
    const [formValue,setFormValue]=useState();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleSubmit=(values)=>{
        console.log("Handle submit",values)
        dispatch(loginUserAction({data: values}))
    }
    return (

            <>
                <Formik
                    onSubmit={handleSubmit}
                    const initialValues={initialValues}
                    // validationSchema={validationSchema}
                    >


                <Form className="space-y-5 ">
                    <div className="space-y-5 ">
                        <div className="p-1 ">
                            <Field as={TextField} name="username" placeholder="Username" type="text" variant="outlined"
                                   fullWidth/>
                            <ErrorMessage name="username" component="div" className="text-red-500">

                            </ErrorMessage>
                        </div>
                        <div className="p-1 ">
                            <Field as={TextField} name="password" placeholder="Password" type="password" variant="outlined"
                                   fullWidth/>
                            <ErrorMessage name="password" component="div" className="text-red-500">

                            </ErrorMessage>
                        </div>

                    </div>
                    <Button  sx={{padding:'0.8rem 0rem',backgroundColor:'orange',height:'20%'}} fullWidth type="submit" variant="container" color="primary" >Login</Button>

                </Form>
                </Formik>
                <div className="flex items-center justify-center gap-2 pt-5">
                    <p>If you don't have account</p>
                    <Button onClick={()=>navigate("/register")}>Register</Button>
                </div>
            </>
    );
}

export default Login;