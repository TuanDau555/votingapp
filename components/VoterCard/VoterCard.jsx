import React from 'react';
import Image from 'next/image';

// Internal import
import Style from '../Card/Card.module.css';
import image from '../../assets';
import voterCardStyle from './VoterCard.module.css';

const VoterCard = ({voterArray}) => {
  return (
    <div className={Style.card}>
      {voterArray.map((el, i) =>(
        <div className={Style.card_box}>
          <div className={Style.image}>
            <img src={el[4]} alt='Profile Photo'/>
          </div>

          <div className={Style.card_info}>
            <h2>
              {el[1]} #{el[0].toNumber()}
            </h2>
            <p>Address: {el[3].slice(0, 30)}</p>
            <p>details</p>
            <p className={voterCardStyle.vote_Status}>
              {el[6] == true ? "You are already vote" : "Not vote"}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VoterCard
