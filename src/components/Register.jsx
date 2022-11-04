import { async } from "@firebase/util";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase";
import requests from "../Request";
const ethers = require('ethers')


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [successAuth, setSuccess] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user && successAuth) return navigate("/transfer");

    console.log(email, password);
  }, [user, loading, successAuth]);

  async function registerUser() {
    try {
      if (!email) alert("Please enter email");
      if (!password) alert("Please enter password");
      registerWithEmailAndPassword(name, email, password);

      const wallet = ethers.Wallet.createRandom()

      if(wallet){
        const user = {
          email: email,
          wallet: wallet.address, 
          mnemonic: wallet.mnemonic.phrase, 
          privatekey: wallet.privateKey
        };

        await axios.post(requests.registerUser, user).then((response) => {
          setMessage("Account created")
        });
  
        setSuccess(true)
      }
      console.log(user)
    } catch {
      setMessage("Account exists ")
      setSuccess(false)
    }
  }

  function withGoogle(){
    signInWithGoogle()

    setSuccess(true)
  }

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>Register</div>

        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
        </div>

        <div className={style.transferPropContainer}>
          <input
            type="password"
            className={style.transferPropInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <div className={style.confirmButton} onClick={registerUser}>
          Register
        </div>

        {/* <div className={style.confirmButton} onClick={withGoogle}>
          Register with Google
        </div> */}

        <div className="flex justify-center">{message}</div>

        <div>
          Already have an account? <Link to="/login">Login</Link> now.
        </div>
      </div>
    </div>
  );
}

const style = {
  wrapper: `w-screen flex items-center justify-center mt-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

export default Register;
