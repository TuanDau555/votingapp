import React, {useState, useEffect, useContext} from 'react';
import Image from 'next/image';
import Countdown from 'react-countdown';

// Internal Import
import { VotingContext } from '../context/Voter';
import Style from '../styles/index.module.css';
import Card from '../components/Card/Card';
import image from '../assets/candidate-1.jpg';


const index = () => {
  const { getNewCandidate, candidateArray, giveVote, currentAccount, checkIfWalletConnected, candidateLength, voterLength } = useContext(VotingContext);

  useEffect(()=>{
    checkIfWalletConnected();
  }, []);
  
  return (
    <div className= {Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                No candidate: <span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                No voter: <span>{voterLength}</span>
              </p>
            </div>
          </div>

          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 100000}/>
            </small>
          </div>
        </div>
      )}

      <Card candidateArray= {candidateArray} giveVote={giveVote}/>
    </div>
  );
};

export default index;
