import React, { useState } from 'react'
import { ethers } from 'ethers'

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

export default function Interactions(props) {
  
  const [transferHash, setTransferHash] = useState(null)
  
  const transferHandler = async(e) => {
    e.preventDefault(); 
    let transferAmount = e.target.sendAmount.value; 
    let recieverAddress = e.target.recieverAddress.value; 

    let txt = await props.contract.transfer(recieverAddress, transferAmount);
    setTransferHash(txt.hash)
  }
  return(
    <div>
      <form onSubmit={transferHandler}>
      <div className={style.transferPropContainer}>
          <input
            type='number'
            className={style.transferPropInput}
            placeholder='0.0'
            pattern='^[0-9]*[.,]?[0-9]*$'
            // onChange={e => handleChange(e, 'amount')}
            id='sendAmount'
          />
        </div>
        <div className={style.transferPropContainer}>
          <input
            type='text'
            className={style.transferPropInput}
            placeholder='0x...'
            // onChange={e => handleChange(e, 'addressTo')}
            id="recieverAddress"
          />
          <div className={style.currencySelector}></div>
        </div>
        <div  type="submit" className={style.confirmButton}>
          <button type='submit'>Confirm</button>
        </div>
        
        <div>
          <h1>TX hash: </h1>
          {transferHash}
        </div>

      </form>
      





      {/* <form onSubmit={transferHandler}>
        <h3>Make transaction</h3>
        <p> Reciever Address</p>
        <input type="text" id="recieverAddress" ></input>

        <p>Send Amount</p>
        <input type='number' id='sendAmount' min='0' step='1'></input>
        
        <button type="submit" >Send</button>
        <div>
          {transferHash}
        </div>
      </form> */}
    </div>
  )
}
