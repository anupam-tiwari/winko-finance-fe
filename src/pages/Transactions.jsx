import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TransactionGrid from '../components/TransactionGrid'


const Transactions = () => {
  return (
    <div>
        <Navbar></Navbar>
        <TransactionGrid></TransactionGrid>
    </div>
  )
}

export default Transactions