import React, { useEffect, useState } from 'react';
import {Item} from './AllAnalysis'
import config from "src/config";
import './analysis.css'

const GeneralAnalysis = ({success, onSuccess}) => {

    const [generalAnalysis, setGeneralAnalysis] = useState([])

    const GeneralAnalysis = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/get_analysis`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setGeneralAnalysis(data.message)
            } else {
                console.error('Error fetching coin bots:', data.message);
            }
        } catch (error) {
            console.error('Error fetching coin bots:', error);
        }
    };

    useEffect(()=> {
        GeneralAnalysis()
    }, [])

    useEffect(()=>{
        if (success){
            GeneralAnalysis()
        }
      }, [success])

    console.log('generalAnalysis: ', generalAnalysis)
    
  return (
    <div className='allAnalysismain'>
      <h3 className='allAnalysisTitle'>General Analysis</h3>
      {generalAnalysis && generalAnalysis.length > 0 ?
      <ul className='allAnalysisUL'>
      {generalAnalysis?.map(item => (
        <Item key={item.analysis_id} item={item} base64Image={item.analysis_images[0].image} />
      ))}
        </ul>: <span>No Analysis yet</span>
      }
    </div>
  );
};

export default GeneralAnalysis