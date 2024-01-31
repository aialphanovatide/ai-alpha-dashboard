import React, { useState } from 'react'
import Introduction from '../introduction/Introduction'
import Tokenomics from '../tokenomics/Tokenomics'
import Competitors from '../competitors/Competitors'
import classnames from 'classnames'

const Fundamentals = () => {
  const [activeTab, setActiveTab] = useState('introduction')

  const toggleTab = (tab) => {
    console.log('Changing tab to:', tab)
    setActiveTab(tab)
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <a
                className={classnames('nav-link', { active: activeTab === 'introduction' })}
                onClick={() => toggleTab('introduction')}
              >
                Introduction
              </a>
            </li>
            <li className="nav-item">
              <a
                className={classnames('nav-link', { active: activeTab === 'tokenomics' })}
                onClick={() => toggleTab('tokenomics')}
              >
                Tokenomics
              </a>
            </li>
            <li className="nav-item">
              <a
                className={classnames('nav-link', { active: activeTab === 'competitors' })}
                onClick={() => toggleTab('competitors')}
              >
                Competitors
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'introduction' && (
            <div>
              {console.log('Rendering Introduction')}
              <Introduction />
            </div>
          )}
          {activeTab === 'tokenomics' && (
            <div>
              <Tokenomics />
            </div>
          )}
          {activeTab === 'competitors' && (
            <div>
              <Competitors />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Fundamentals
