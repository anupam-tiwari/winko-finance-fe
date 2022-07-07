import React, { useState } from 'react'
import { db } from '../firebase'
import {updateDoc} from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { collection, getDocs, where, query, doc} from 'firebase/firestore';

const ConnectWallet = () => {
    const [walletAddress, SetWalletAddress] = useState("");
    const [user,loading,error] = useAuthState(auth);
    const [userEmail, setEmail] =  useState(""); 
    const [userData, setUserData] = useState([]);

    const userCollectionRef = collection(db,"users")

  

    const connectWalletHandler = async () => {
        if(window.ethereum && window.ethereum.isMetaMask){
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result =>{   
            SetWalletAddress(result[0])
            setEmail(user.email)
            findCollectionID(userEmail) 

    
            })
            .catch(error => {
              //setErrorMsg()
              console.log(error)
            })
        }
        else{
          console.log("need to install metamask");
          //errorMessage("Please Install Metamask");
        }
      }

      const findCollectionID = async (email) => {
        const q = query(userCollectionRef, where("uid", "==", email));
        const data = await getDocs(q)
        setUserData(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        console.log(userData[0])
        addressToDB(userData[0].id, walletAddress)
      }

      const addressToDB = async (id, Walletaddress) => {
        const userDoc = doc(db,"users",id)
        const newFields = {WalletAddress: Walletaddress}
        await updateDoc(userDoc,newFields)
      }


  return (
    <div>
        <h1 className='text-black'>waller interface</h1>
        <button className={style.confirmButton} onClick={connectWalletHandler} >Connect Wallet to Account</button>
    </div>
  )
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
  }

export default ConnectWallet