import React, { useEffect, useState } from 'react';
import config from "src/config";
import '../analysis/analysis.css'
import Swal from 'sweetalert2'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import './topStories.css'


const Modal = ({ item, base64Image, onClose }) => {

  const formattedSummary = item.summary.replace(/\n/g, '<br>')

    return (
      <div className="modalOverlay" onClick={onClose}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          {base64Image && (
            <img
              className="modalImage"
              src={`data:image/png;base64,${base64Image}`}
              alt="top sotry"
            />
          )}
        <span className="modalText" dangerouslySetInnerHTML={{ __html: formattedSummary }} />
          <button className="closeButton" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };


const Item = ({ item, base64Image, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = (e) => {
        onDelete(item.top_story_id);
      };
  
      const handleItemClick = (e) => {

        // Check if the click target or its parent has the deleteBtn class
        if (
            e.target.classList.contains('deleteBtn') ||
            e.target.parentElement.classList.contains('deleteBtn')
        ) {
            // If it is, do not open the modal
            return;
        }
        setIsModalOpen(true);
      };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const formattedSummary = item.summary.replace(/\n/g, '<br>')
  
    return (
      <>
        <li className="allTopStoriesLI" onClick={handleItemClick}>
          {base64Image && (
            <img
              className="itemImage"
              src={`data:image/png;base64,${base64Image}`}
              alt="Analysis"
            />
          )}
          <span className="itemContent" dangerouslySetInnerHTML={{ __html: formattedSummary }} />
          {onDelete && <CIcon size="xxl" icon={cilTrash} className="deleteBtn" onClick={handleClick} />}
        </li>
        {isModalOpen && (
          <Modal item={item} base64Image={base64Image} onClose={handleCloseModal} />
        )}
      </>
    );
  };
  

const TopStories = () => {

    const [topStories, setTopStories] = useState([])
    
    // gets all the top stories
    const getTopStories = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/get/allTopStories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setTopStories(data.top_stories)
            } else {
                console.error('Error fetching:', data.top_stories);
            }
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    // Deletes a top story
    const handleDelete = async (top_story_id) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/delete/top-story/${top_story_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                getTopStories() 
            } else {
                console.error('Error deleting:', data);
                Swal.fire({
                    icon: "error",
                    title: data.error,
                    showConfirmButton: false,
                    
                });
            }
        } catch (error) {
            console.error('Error deleting:', error);
            Swal.fire({
                icon: "error",
                title: error,
                showConfirmButton: false,
            });
        }
    };

    useEffect(()=> {
        getTopStories()
    }, [])
    
  return (
    <div className='alltopStoriesmain'>
      <h3 className='alltopStoriesTitle'>Top Stories</h3>
      {topStories && topStories.length > 0 ?
      <ul className='alltopStoriesUL'>
      {topStories?.map(item => (
        <Item key={item.top_story_id} item={item} onDelete={handleDelete}  />
      ))}
        </ul>: <span>No Top Stories yet</span>
      }
    </div>
  );
};

export default TopStories