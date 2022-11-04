import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { collection, getDocs, where, query, doc } from "firebase/firestore";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../firebase";
import { ethers } from "ethers";
import winkoTokenAbi from "../contract/winkoTokenABI.json";
import axios from "axios";
import requests from "../Request";
import { FaUser } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";

const Profile = () => {
  const [connectedwalletAddress, SetWalletAddress] = useState("");
  const [privateAddress, SetPrivateAddress] = useState("");
  const [mnemonic, SetMnemonic] = useState("");
  const [errormsg, setError] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [balance, setBalance] = useState(null);
  const [balanceETH, setEthBalance] = useState(null);
  const [currentAddress, setcurrentAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [tokenName, setTokenName] = useState("Token");
  const [refresh, setRefresh] = useState(true);
  const contractAddress = "0x329BEEeD3277d359857b710244719055bA5b0455";
  const url = 'https://liberty10.shardeum.org/';
  const RPCprovider = new ethers.providers.JsonRpcProvider(url);
  //const RPCprovider = new ethers.providers.AlchemyProvider("maticmum");

  // {
  //   user && Getprofile();
  // }

  useEffect(() => {
    if (user) {
      console.log("refresh")
      Getprofile();
    }
  }, [refresh]);

  //anupam@winko.com

  async function Getprofile() {
    if (user) {
      await axios.get(requests.getUser + user.email).then((response) => {
        let wallet = new ethers.Wallet(response.data.privatekey);
        let walletSigner = wallet.connect(RPCprovider);
        let tempContract = new ethers.Contract(
          contractAddress,
          winkoTokenAbi,
          walletSigner
        );
        setContract(tempContract);
        setcurrentAddress(response.data.wallet);
        SetPrivateAddress(response.data.privatekey);
        SetMnemonic(response.data.mnemonic);
        updateBalance(tempContract);
      });
    }
  }

  async function updateBalance(contract) {
    try {
      if (currentAddress) {
        let balanceBig = await contract.balanceOf(currentAddress);
        let balanceNumber = balanceBig.toNumber();
        let decimals = await contract.decimals();
        let tokenBalance = balanceNumber / Math.pow(10, decimals);
        

        setBalance(tokenBalance);
        setTokenName(await contract.name());
      }
    } catch(error){
      console.error(error)
    }
  }

  function refresher() {
    if (refresh == true) {
      setRefresh(false);
    } else setRefresh(true);
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className="w-screen flex items-center justify-center mt-14">
        {user && (
          <div className="bg-[#191B1F] w-[20rem] rounded-2xl p-4 sm:w-[20rem] lg:w-[40rem] md:w-[30rem]">
            <div
              className="flex justify-end cursor-pointer"
              onClick={refresher}
            >
              <BiRefresh className="w-5 h-5"></BiRefresh>
            </div>
            <div className="flex justify-center text-[#2172E5] p-8">
              <FaUser className="w-20 h-20"></FaUser>
            </div>
            <div className="p-2">Email: {user.email}</div>
            <div className="p-2">Crypto Address: {currentAddress}</div>
            <div className="p-2">Private Key: {privateAddress}</div>
            <div className="p-2">Mnemonic: {mnemonic}</div>
            {/* <div className="p-2">balance: {balanceETH} Eth</div> */}
            <div className="p-2">
              balance: {balance} {tokenName}
            </div>

            {/* <div className={style.confirmButton} onClick={updateAddress}>
              Change/Add ETH Address
            </div> */}
            <div>
              <h1 className="text-#2172E5">{errormsg}</h1>
            </div>
          </div>
        )}
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
  normalButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center border border-[#2172E5] hover:border-[#234169]`,
};

export default Profile;
