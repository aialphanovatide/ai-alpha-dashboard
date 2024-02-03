import React, { useState } from 'react'
import Introduction from '../introduction/Introduction'
import Tokenomics from '../tokenomics/Tokenomics'
import Competitors from '../competitors/Competitors'
import classnames from 'classnames'
import RevenueModels from '../revenueModel/RevenueModels'
import Hacks from '../hacks/Hacks'
import DApps from '../dapps/DApps'
import Upgrades from '../upgrades/Upgrades'

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
            <li className="nav-item">
              <a
                className={classnames('nav-link', { active: activeTab === 'revenueModels' })}
                onClick={() => toggleTab('revenueModels')}
              >
                Revenue Models
              </a>
            </li>
            <li className="nav-item">
              <a
                className={classnames('nav-link', { active: activeTab === 'hacks' })}
                onClick={() => toggleTab('hacks')}
              >
                Hacks
              </a>
            </li>
            <li className="nav-item">
              <a
                className={classnames('nav-link', { active: activeTab === 'upgrades' })}
                onClick={() => toggleTab('upgrades')}
              >
                Upgrades
              </a>
            </li>
            <li className="nav-item">
              <a
                className={classnames('nav-link', { active: activeTab === 'dapps' })}
                onClick={() => toggleTab('dapps')}
              >
                DApps
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
          {activeTab === 'revenueModels' && (
            <div>
              <RevenueModels />
            </div>
          )}
          {activeTab === 'hacks' && (
            <div>
              <Hacks />
            </div>
          )}
          {activeTab === 'upgrades' && (
            <div>
              <Upgrades />
            </div>
          )}
          {activeTab === 'dapps' && (
            <div>
              <DApps />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Fundamentals
