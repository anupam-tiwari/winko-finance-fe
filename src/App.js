import { Route, Routes } from 'react-router-dom';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import Register from './components/Register';
import Reset from './components/Reset';
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import Profile from './pages/Profile';

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#ffffff] text-white select-none flex flex-col justify-top`,
}
//app start
function App() {
  return (
    <div className={style.wrapper}>
    <Routes>
      <Route path='/' element={<Landing></Landing>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/reset" element={<Reset />} />
      <Route path='/transfer' element={<Transfer></Transfer>}></Route>
      <Route path='/transactions' element={<Transactions></Transactions>}></Route>
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route path='/profile' element={<Profile></Profile>}></Route>
    </Routes>
    </div>
  );
}

export default App;
