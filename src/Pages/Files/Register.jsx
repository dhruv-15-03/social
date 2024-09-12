import {FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {ErrorMessage, Field, Form, Formik} from "formik";
import React,{useState} from "react";
import * as Yup from "yup"
import {Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {registerUserAction} from "../../Redux/Auth/auth.actiion";
import { useNavigate } from "react-router-dom";

const initialValues={name:"",email:"",userName:"",password:"",gender:""}
const validationSchema={email:Yup.string().required("Username is Required"),
    password:Yup.string().min(6,"Password must be at least 6 Characters Long").required("Password is required")}



const Register=()=> {
    const handleSubmit=(values)=>{
        values.gender=gender
        console.log("Handle submit",values)
        dispatch(registerUserAction({data:values}))
    };
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const[gender,setGender]=useState("")
    const handleChange=(event)=> {
        setGender(event.target.value);
    };
    return (

        <>
            <Formik
                onSubmit={handleSubmit}
                // validationSchema={validationSchema}
                initialValues={initialValues}
            >


                <Form className="space-y-5 ">
                    <div className="space-y-5 ">
                        <div className="p-1 ">
                            <Field as={TextField} name="name" placeholder="Name" type="text" variant="outlined"
                                   fullWidth/>
                            <ErrorMessage name="name" component="div" className="text-red-500">

                            </ErrorMessage>
                        </div>
                        <div className="p-1 ">
                            <Field as={TextField} name="email" placeholder="Email" type="email" variant="outlined"
                                   fullWidth/>
                            <ErrorMessage name="email" component="div" className="text-red-500">

                            </ErrorMessage>
                        </div>
                        <div className="p-1 ">
                            <Field as={TextField} name="userName" placeholder="Username" type="text" variant="outlined"
                                   fullWidth/>
                            <ErrorMessage name="username" component="div" className="text-red-500">

                            </ErrorMessage>
                        </div>
                        <div className="p-1 ">
                            <Field as={TextField} name="password" placeholder="Password" type="password"
                                   variant="outlined"
                                   fullWidth/>
                            <ErrorMessage name="password" component="div" className="text-red-500">

                            </ErrorMessage>
                        </div>
                        <div>
                            <RadioGroup
                                row
                                aria-labelledby="Gender"
                                name="gender"
                                onChange={handleChange}
                            >
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                                <ErrorMessage name="gender" component="div" className="text-red-500">

                                </ErrorMessage>
                            </RadioGroup>
                        </div>

                    </div>
                    <Button sx={{padding: '0.8rem 0rem', backgroundColor: 'orange', height: '20%'}} fullWidth
                            type="submit" variant="container" color="primary">Register</Button>

                </Form>
            </Formik>
                <div className="flex items-center justify-center gap-2 pt-5">
                    <p>Already have an account??</p>
                    <Button onClick={()=>navigate("/login")}>Login</Button>
                </div>
        </>
    );
}

export default Register;