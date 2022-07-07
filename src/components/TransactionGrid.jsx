import React, { useEffect, useState } from 'react'
import axios from 'axios'


const style = {
  wrapper: `w-screen flex items-center justify-center mt-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex  justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
}

const api_key = "6VG49GZU75CC9DX7P3Z8J5Y9JAAJG2VZSF"
const tx_URL = `https://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=0x329beeed3277d359857b710244719055ba5b0455&page=1&offset=100&startblock=0&endblock=99999999&sort=desc&apikey=${api_key}`;



const TransactionGrid = () => {
const[transactions, setTransactions] = useState([])

const truncateString = (str, num) => {
  if(str?.length > num){
      return str.slice(0,num) + '...';
  } else {
      return str;
  }
}

useEffect(() => {
    axios.get(tx_URL).then((response) => {
      setTransactions(response.data.result)
      
    })
}, [])

console.log(transactions)



  return (
    <>

<div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Transaction History</div>
        </div>
        <div className='pt-2'>
        <div className={style.formHeader}>
          <div>From</div>
          <div>To</div>
          <div>Token</div>
        </div>

        <div className='pt-2 text-blue'>
          {transactions.map((items, index) => (
            <div className={style.formHeader}>
            <div>{truncateString(items.from,6)}</div>
            <div>{truncateString(items.to, 6)}</div>
            <div>{(items.value)/100}</div>
          </div>
          ))}
        </div>

        </div>
      <div>
 </div>
        
      </div>
    </div>
    </>
  )
}

export default TransactionGrid