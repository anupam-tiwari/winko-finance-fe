import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogInWithEmailAndPassword, auth, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsGoogle } from "react-icons/bs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/transfer");
  }, [user, loading]);

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>Login</div>

        {/* <form> */}
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            value={email}
            placeholder="E-mail Address"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <div className={style.transferPropContainer}>
          <input
            type="password"
            className={style.transferPropInput}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        <div
          className={style.confirmButton}
          onClick={() => LogInWithEmailAndPassword(email, password)}
        >
          Login
        </div>
        {/* </form> */}

        <div className={style.confirmButton} onClick={signInWithGoogle}>
          <div className={style.currencySelectorIcon}>
            {/* <BsGoogle></BsGoogle>{" Sign iN "} */}
            Login using Google
          </div>
        </div>
        <div>
          <div className="cursor-pointer" onClick={() => navigate("/reset")}>
            Forgot Password?
          </div>
        </div>
        <div className="flex">
          Don't have an account?
          <div
            className="cursor-pointer px-1 text-[#2172E5]"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </div>
        </div>
      </div>
    </div>
  );
};

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
export default Login;
