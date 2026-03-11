import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {AiFillLock, AiFillUnlock} from "react-icons/ai";

// Internal Import
import {VotingContext} from "../../context/Voter";
import Style from './NavBat.module.css';
import loading from '../../assets/gradient_loader_01.gif'

const NavBar = () => {
  const {connectWallet, error, currentAccount} = useContext(VotingContext);
  
  const [openNav, setOpenNav] = useState(true);

  const openNavigation = ()=>{
    if(openNav){
      setOpenNav(false)
    }else if(!openNav){
      setOpenNav(true);
    }
  }
  
  return (
    <div className={Style.navBar}>
      {error === "" ? (
        ""
      ): (
        <div className={Style.message_box}>
          <div className={Style.message}>
            <p>{error}</p>
          </div>
        </div>
      )}
      <div className={Style.navBar_box}>
        <div className={Style.title}>
          <Link href="/">
            <a>
              <Image src={loading} alt="logo" width={80} height={80}/>
            </a>
        </Link>
        </div>

        <div className={Style.connect}>
          {currentAccount ? (
            <div>
              <div className={Style.connect_flex}>
                <button onClick={()=> openNavigation()}>
                  {currentAccount.slice(0, 10)}...
                </button>
                {currentAccount && (
                  <span>{openNav ? (
                    <AiFillUnlock onClick={openNavigation}/>
                  ): (
                    <AiFillUnlock onClick={openNavigation}/>
                  )}</span>
                )}
              </div>

              {openNav && (
                <div className={Style.navigateion}>
                  <p>
                    <Link href={{pathname: '/'}}>Home</Link>
                  </p>
                  <p>
                    <Link href={{pathname: '/candidate-registration'}}>
                      Candidate Regitration
                    </Link>
                  </p>
                  <p>
                    <Link href={{pathname: '/allowed-voters'}}>
                      Voter Regitration
                    </Link>
                  </p>
                  <p>
                    <Link href={{pathname: '/voterlist'}}>
                      Voter List
                    </Link>
                  </p>
                </div>
              )}
            </div>
          ) :(
            <button onClick={()=> connectWallet()}>Connect Wallet</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar
