import React from "react";
import { RiSettings3Fill } from "react-icons/ri";
import { useState } from "react";
import winkoTokenAbi from "../contract/arb_winkoToken.json";
import { ethers } from "ethers";
import requests from "../Request";
import axios from "axios";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import loadingGIF from "../assets/loading.gif";

const TransferBox = () => {
  const contractAddress = "0x329BEEeD3277d359857b710244719055bA5b0455";
  const [transferHash, setTransferHash] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [recieverAddress, setRecieverAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [recieverEmail, SetEmail] = useState("");
  const [resultMessage, setMessage] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [privateKey, setPrivateKey] = useState("");
  const url = 'https://liberty10.shardeum.org/';
  const RPCprovider = new ethers.providers.JsonRpcProvider(url);
  //const RPCprovider = new ethers.providers.AlchemyProvider("maticmum");
  const [txsuccess, setTxSucess] = useState("");
  const [txStatus, setTxStatus] = useState('')
  const [buttonState, SetButtonState] = useState(false)

  useEffect(() => {
    FindWalletAddress(recieverEmail);
  }, [recieverEmail]);

  useEffect(() => {
    if (user) {
      GetUser(user.email);
    }
  }, [user]);

  useEffect(() => {
    checkStatus()
  }, [transferHash])

  const GetUser = async (email) => {
    try {
      await axios.get(requests.getUser + email).then((response) => {
        setPrivateKey(response.data.privatekey);
      });
    } catch {
      console.log("cannot fetch");
    }
  };

  const FindWalletAddress = async (email) => {
    if (email.length > 0) {
      try {
        await axios.get(requests.getUser + email).then((response) => {
          setRecieverAddress(response.data.wallet);
          setMessage(`Address Found: ${response.data.wallet}`);
        });
      } catch {
        console.log("no address found");
        setMessage("No Address found");
      }
    }
  };

  const transferHandler = async () => {
    SetButtonState(true)
    try {
      let wallet = new ethers.Wallet(privateKey);
      let walletSigner = wallet.connect(RPCprovider);
      let tempContract = new ethers.Contract(
        contractAddress,
        winkoTokenAbi,
        walletSigner
      );
      setContract(tempContract);
      const tx = await tempContract
        .transfer(recieverAddress, transferAmount)
        .then((transferResult) => {
          console.log(transferResult);
          setTransferHash(transferResult.hash);
          setTxStatus("Tx Processing...")
        });
    } catch(error){
      SetButtonState(false)
      console.error(error)
    }
  };

  function checkStatus(){
    if(transferHash){
      if(txStatus == "Tx Confirmed"){
        return
      }else{
        setInterval(() => {
          CheckTxStatus()
        }, 5000);
      }
    }
  }

  function CheckTxStatus(){
    RPCprovider.getTransactionReceipt(transferHash)
    .then((result) => {
      if (result) {
        setTxSucess(true);
        setTxStatus("Tx Confirmed")
        SetButtonState(false)
      }
    })
    .catch(console.log("not yet cofirmed"));
  }

 

  return (
    user && (
      <div className={style.wrapper}>
        <div className={style.content}>
          <div className={style.formHeader}>
            <div>Transfer</div>
            <div>
              <RiSettings3Fill />
            </div>
          </div>
          <div className={style.transferPropContainer}>
            <div className={style.transferPropInput}>From: {user.email}</div>
          </div>
          <div className="justify-center flex p-2 text-2xl">
            <BsFillArrowDownCircleFill></BsFillArrowDownCircleFill>
          </div>
          <div className={style.transferPropContainer}>
            <div className="pr-2">To:</div>
            <input
              type="text"
              className={style.transferPropInput}
              placeholder="Email"
              onChange={(e) => SetEmail(e.target.value)}
            />
          </div>
          <div className={style.transferPropContainer}>
            <div className="pr-2">Amount:</div>
            <input
              type="text"
              className={style.transferPropInput}
              placeholder="0.0"
              pattern="^[0-9]*[.,]?[0-9]*$"
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </div>
          <div>{resultMessage}</div>
          <div>
            <a
              href={`https://mumbai.polygonscan.com/tx/${transferHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transferHash}
            </a>
          </div>
          {/* onClick={e => handleSubmit(e)} */}
          <button onClick={transferHandler} disabled={buttonState} className={style.confirmButton}>
            {!buttonState && <div>Confirm</div>}
            {buttonState && <div><img src={loadingGIF} alt="" /></div>} 
          </button>
          <div>{txStatus}</div>
        </div>

        {/* <Modal isOpen={!!router.query.loading} style={customStyles}>
        <TransactionLoader />
      </Modal> */}
      </div>
    )
  );
};

const style = {
  wrapper: `w-screen flex items-center justify-center mt-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-2xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl w-full font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

export default TransferBox;
