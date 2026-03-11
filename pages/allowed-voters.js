import React, {useState, useEffect, useCallback, useContext} from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

// Internal Import
import { VotingContext } from '../context/Voter';
import Style from '../styles/allowedVoter.module.css';
import images from '../assets';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

const allowedVoters = ()=>{
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });

  const router = useRouter();
  const { uploadToIPFS, createVoter, voterArray, getAllVoterData } = useContext(VotingContext);

  //--- Voters Image Drop
  
  const onDrop = useCallback(async(acceptedFil) => {
    const url = await uploadToIPFS(acceptedFil[0]);
    setFileUrl(url);
    
  });

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    maxSize: 5000000,
    multiple: false,
  });

  useEffect(()=>{
    getAllVoterData()
  }, []);
  
  // ---- JSX 
  
  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt='Voting image'/>
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbsp; {formInput.name}</span>
              </p>
              <p>
                Add: <span>&nbsp; {formInput.address.slice(0, 20)}</span>
              </p>
              <p>
                Pos: <span>&nbsp; {formInput.position}</span>
              </p>
            </div>
          </div>
        )}

        {
          !fileUrl && (
            <div className={Style.sideInfo}>
              <div className={Style.sideInfo_box}>
                <h4>Create candidate for voting</h4>
                <p>
                  Blockchain voting organization, provide blockchain eco system
                </p>
                <p className={Style.sideInfo_paragraph}>
                  Contract Candidate
                </p>
              </div>

              <div className={Style.card}>
                {voterArray.map((el, i) => (
                  <div key={i + 1} className={Style.card_box}>
                    <div className={Style.image}>
                      <img src={el[4]} alt='Profile Photo'/>
                    </div>

                    <div className={Style.card_info}>
                      <p>{el[1]}</p>
                      <p>Address: {el[3].slice(0, 10)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
        
      </div>

      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h1>Create New Voter</h1>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}>
                <input {...getInputProps()}/>

                <div className={Style.voter_container_box_div_info}>
                  <p>Upload File Max 10MB</p>

                  <div className={Style.voter_container_box_div_image}>
                    <Image src={images.upload} width={150} height={150} objectFit="contain" alt="Image"/>
                  </div>
                  <p>Drag and Drop File or Browse on your device</p>
                </div>
              </div>
            </div>
          </div> 
        </div>

        <div className={Style.input_container}>
          <Input inputType="text" title="Name" placeholder="Voter Name" handleClick={
            (e) => setFormInput({...formInput, name: e.target.value})}
          />
          <Input inputType="text" title="Address" placeholder="Voter Adress" handleClick={
            (e) => setFormInput({...formInput, address: e.target.value})}
          />
          <Input inputType="text" title="Position" placeholder="Voter Position" handleClick={
            (e) => setFormInput({...formInput, position: e.target.value})}
          />
          <div className={Style.Button}>
            <Button btnName="Authorized Voter" handleClick={()=> createVoter(formInput, fileUrl, router)}/>
          </div>
        </div>
      </div>

      {/* {} */}
      <div className={Style.createdVoter}>
        <div className={Style.createdVoter_info}>
          <Image src={images.creator} alt="image"/>
          <p>Notice for User</p>
          <p>Organizer
            <span>0x939939..</span>
          </p>
          <p>
            Only organizer of the voting can create voting for voting election
          </p>
        </div>
      </div>
    </div>
  );
  
};



export default allowedVoters
