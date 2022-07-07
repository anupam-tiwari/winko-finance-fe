import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { logout } from "../firebase";
import { useEffect, useState } from "react";

const Navbar = () => {
  let navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  const [connectedwalletAddress, SetWalletAddress] = useState("");
  const [walletStatus, setStatus] = useState("Connect")
  
  const ConnectWallet = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangeHandler(result[0])
          setStatus("Connected")
          
          //ReplaceUserAddress(user.email, result[0]);
          //updateEthers();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("need to install metamask");
    }
  };

  const accountChangeHandler = (address) => {
    SetWalletAddress(address);
  }

  useEffect(() => {
    if(loading) return
    if(!user) {
        navigate("/")
    }
  }, [user, loading]);

  return (
    <div className="flex justify-between p-4 items-center">
      <div className="cursor-pointer flex justify-center" onClick={() => navigate("/")}>
        <h1 className="text-black font-bold text-3xl">Winko</h1>
      </div>

      {user && (
        <div className="flex justify-center items-cente">
          <div className="flex text-[#191B1F]">
            <div className="flex p-2 cursor-pointer">
              <div onClick={() => navigate("/transfer")}>Transfer</div>
            </div>
            <div className="flex p-2 cursor-pointer">
              <div onClick={() => navigate("/transactions")}>Transactions</div>
            </div>
            <div className="flex p-2 cursor-pointer">
              <div onClick={() => navigate("/profile")}>Profile</div>
            </div>
          </div>
        </div>
      )}

      <div className=" flex items-center">
        {/* {user && <div  className=" text-[#191B1F] px-2 cursor-pointer">
        <div
              className=""
              onClick={ConnectWallet}>
              {walletStatus}
            </div>
        </div>} */}

        {!user && (
          <div
            className="flex items-center bg-[#191B1F] rounded-2xl text-[0.9rem] font-semibold cursor-pointer p-2"
            onClick={() => navigate("./login")}
          >
            <div className="flex items-center justify-center w-8 h-8 mx-4">
              Login
            </div>
          </div>
        )}

        {user && (
          <div
            className="flex items-center bg-[#191B1F] rounded-2xl text-[0.9rem] font-semibold cursor-pointer p-2 "
            onClick={() => {
              navigate("/");
            }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 mx-4"
              onClick={logout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
