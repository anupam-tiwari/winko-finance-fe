import React, { useState, useEffect } from 'react'
import {ethers} from 'ethers'
import Interactions from '../interactions/interactions'
// import winkoTokenAbi from '../contract/winkoTokenABI.json'
import winkoTokenAbi from '../contract/arb_winkoToken.json'
import { RiSettings3Fill } from 'react-icons/ri'
import { AiOutlineDown } from 'react-icons/ai'
import ethLogo from '../assets/eth.png'

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
}

export default function Wallet() {
   // gene cahe chain address
    //const contractAddress = "0x329BEEeD3277d359857b710244719055bA5b0455"; 
    const contractAddress = "0x329BEEeD3277d359857b710244719055bA5b0455"; 

    
    const [tokenName, setTokenName] = useState("Token");
    const [connectButtonText, setConnButtonText] = useState("Connect Wallet");
    const [errorMessage, setErrorMsg] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    const [provider, setProvider]  = useState(null); 
    const [signer, setSigner] = useState(null); 
    const [contract, setContract] = useState(null);

    const connectWalletHandler = () => {
        if(window.ethereum && window.ethereum.isMetaMask){
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result =>{
              accountChangedHandler(result[0]); 
              setConnButtonText("wallet Connected");

            })
            .catch(error => {
              setErrorMsg()
            })
        }
        else{
          console.log("need to install metamask");
          errorMessage("Please Install Metamask");
        }
    }

    const accountChangedHandler = (newAddress) => {
      setDefaultAccount(newAddress); 
      updateEthers();
    }
    
    const updateEthers = () => {
      let tempProvider = new ethers.providers.Web3Provider(window.ethereum); 

      let tempSigner = tempProvider.getSigner(); 

      let tempContract = new ethers.Contract(contractAddress, winkoTokenAbi, tempSigner)

      setProvider(tempProvider)
      setSigner(tempSigner)
      setContract(tempContract)
    }

    useEffect(() => {
      if(contract != null){
        updateBalance(); 
        updateTokenName(); 
      }
    }, [contract])

    const updateBalance = async () =>{
      let balanceBig = await contract.balanceOf(defaultAccount);
      let balanceNumber = balanceBig.toNumber(); 

      let decimals = await contract.decimals(); 

      let tokenBalance = balanceNumber/Math.pow(10,decimals);

      setBalance(tokenBalance);
    }

    const updateTokenName = async () => {
      setTokenName(await contract.name()); 

    }
    

  return (

    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>{tokenName + " Transfer"}</div>
          <button onClick={connectWalletHandler} className={style.confirmButton}>{connectButtonText}</button>
          <div>
            {/* <RiSettings3Fill></RiSettings3Fill> */}
          </div>
        </div>
        <div>
        <div className={style.formHeader}>
            <div>
              <h3>Address: {defaultAccount}</h3>
            </div>
            
        </div>

        <div className={style.formHeader}>
        <div>
              <h3>{tokenName} Balance: {balance}</h3>
            </div>
            {errorMessage}

        </div>

        </div>
        <Interactions contract={contract}></Interactions>
      </div>


      

        
    </div>



  )
}


{/* <h2>{tokenName + "Wallet"}</h2>
<button onClick={connectWalletHandler}>{connectButtonText}</button>

<div >
    <div>
      <h3>Address: {defaultAccount}</h3>
    </div>
    <div>
      <h3>{tokenName} Balance: {balance}</h3>
    </div>
    {errorMessage}
</div>
<Interactions contract={contract}></Interactions>
</div> */}