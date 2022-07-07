import React, { useState, useEffect } from "react";
import ConnectWallet from "../components/ConnectWallet";
import Navbar from "../components/Navbar";
import { collection, getDocs, where, query, doc } from "firebase/firestore";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../firebase";
import { updateDoc } from "firebase/firestore";
import { ethers } from "ethers";
import winkoTokenAbi from "../contract/winkoTokenABI.json";
import axios from "axios";
import requests from "../Request";
import { FaUser } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";

const Profile = () => {
  const [connectedwalletAddress, SetWalletAddress] = useState("");
  const [privateAddress, SetPrivateAddress] = useState("");
  const [mnemonic, SetMnemonic] = useState("");
  const [errormsg, setError] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState([]);
  const [balance, setBalance] = useState(null);
  const [balanceETH, setEthBalance] = useState(null);
  const [currentAddress, setcurrentAddress] = useState("");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenName, setTokenName] = useState("Token");
  const [refresh, setRefresh] = useState(true);
  const [buttonstate, setState] = useState("Connect");

  const userCollectionRef = collection(db, "users");
  const contractAddress = "0x329BEEeD3277d359857b710244719055bA5b0455";
  const RPCprovider = new ethers.providers.AlchemyProvider("maticmum");

  {
    user && Getprofile();
  }

  // const ConnectWallet = async () => {
  //   if (window.ethereum && window.ethereum.isMetaMask) {
  //     await window.ethereum
  //       .request({ method: "eth_requestAccounts" })
  //       .then((result) => {
  //         accountChangeHandler(result[0]);
  //         updateEthers();

  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     console.log("need to install metamask");
  //   }
  // };

  // const accountChangeHandler = (address) => {
  //   SetWalletAddress(address);
  //   getAccountBalance(address.toString());
  // };

  // const getAccountBalance = (account) => {
  //   window.ethereum
  //     .request({ method: "eth_getBalance", params: [account, "latest"] })
  //     .then((balance) => {
  //       setEthBalance(ethers.utils.formatEther(balance));
  //     })
  //     .catch((error) => {
  //       //setErrorMessage(error.message);
  //     });
  // };

  // window.ethereum.on("accountsChanged", accountChangeHandler);

  // const updateAddress= () => {
  //   ReplaceUserAddress(user.email, connectedwalletAddress);
  // }

  // async function ReplaceUserAddress(email, newWalletAddress) {
  //   try{const user = {
  //     id: email,
  //     wallet: newWalletAddress,
  //   };
  //   await axios.put(requests.addWallet, user).then((response) => {
  //     console.log(response);
  //   });}
  //   catch{
  //     console.log("error")
  //   }
  // }

  useEffect(() => {
    if (user != null) {
      Getprofile();
    }

    if (contract != null) {
      updateBalance();
      updateTokenName();
    }
  }, [refresh]);

  async function Getprofile() {
    if (user) {
      await axios.get(requests.getUser + user.email).then((response) => {
        setcurrentAddress(response.data.wallet);
        SetPrivateAddress(response.data.privatekey);
        SetMnemonic(response.data.mnemonic);
      });

      let wallet = new ethers.Wallet(privateAddress);
      let walletSigner = wallet.connect(RPCprovider);
      let tempContract = new ethers.Contract(
        contractAddress,
        winkoTokenAbi,
        walletSigner
      );

      setContract(tempContract)
    }
  }

  const updateBalance = async () => {
    let balanceBig = await contract.balanceOf(currentAddress);
    let balanceNumber = balanceBig.toNumber();

    let decimals = await contract.decimals();

    let tokenBalance = balanceNumber / Math.pow(10, decimals);

    setBalance(tokenBalance);
  };

  const updateTokenName = async () => {
    setTokenName(await contract.name());
  };

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
          <div className="bg-[#191B1F] w-[40rem] rounded-2xl p-4">
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

            {connectedwalletAddress && (
              <div className=" flex p-2 items-center">
                Connected Address: {connectedwalletAddress}
                <div className="text-green-500">
                  <GoPrimitiveDot className="p"></GoPrimitiveDot>
                </div>
              </div>
            )}
            {/* <div className="p-2">balance: {balanceETH} Eth</div> */}
            <div className="p-2">
              balance: {balance} {tokenName}
            </div>

            <div className={style.confirmButton} onClick={ConnectWallet}>
              {buttonstate}
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
