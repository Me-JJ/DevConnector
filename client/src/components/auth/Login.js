import React from 'react';
import { useState } from 'react';
import {Link} from "react-router-dom";
// import axios from 'axios';
// axios.defaults.baseURL = 'http://localhost:5050'
const Login = () => {

  const [formData,setFormData]=useState({
    email:"",
    password:""
  });

const {email,password}=formData;
// eslint-disable-next-line
const onChange= e => setFormData({...formData,[e.target.name]:e.target.value});

const onSubmit = async e =>{
  e.preventDefault();

  console.log("Success");
    // const newUser={
    //   name,email,password
    // };

    // try{

    //   const config={
    //     header:{"Content-Type":"application/json"}
    //   };

    //   // const body= JSON.stringify(newUser);
    //   // console.log(body);

    //   const res=await axios.post("/api/users",newUser,config);
    //   console.log(res.data);
    // }
    // catch(err)
    // {
    //   console.error(err.response.data);
    // }
  // }
}
  return (
    <section className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input 
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange= {e => onChange(e)} 
          required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange= {e => onChange(e)} 
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  );
}

export default Login;
