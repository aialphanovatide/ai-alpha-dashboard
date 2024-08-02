import React, { useEffect, useState } from 'react';
import config from "src/config";
import '../analysis/analysis.css';
import Swal from 'sweetalert2';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import './topStories.css';
import { format } from 'date-fns';

const Modal = ({ item, base64Image, onClose }) => {
    const formattedSummary = item.analysis ? item.analysis.replace(/\n/g, '<br>') : item.content.replace(/\n/g, '<br>')

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                {base64Image && (
                    <img
                        className="modalImage"
                        src={`https://appnewsposters.s3.us-east-2.amazonaws.com/${base64Image}`}
                        alt="top story"
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
        e.stopPropagation();
        onDelete(item.id);  // Usamos article_id aquí
    };

    const handleItemClick = (e) => {
        if (e.target.classList.contains('deleteBtn') || e.target.parentElement.classList.contains('deleteBtn')) {
            return;
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const formattedSummary = item.analysis ? item.analysis.replace(/\n/g, '<br>') : item.content.replace(/\n/g, '<br>')
    const formattedDate = format(new Date(item.date), 'MMMM dd, yyyy');
    console.log(item)
    return (
        <>
            <div className="card" onClick={handleItemClick}>
                {base64Image && (
                    <img
                        className="card-img-top"
                        src={`https://appnewsposters.s3.us-east-2.amazonaws.com/${base64Image}`}
                        alt="Analysis"
                    />
                )}
                <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text" dangerouslySetInnerHTML={{ __html: formattedSummary }} />
                    <p className="card-date">{formattedDate}{onDelete && <CIcon size="xxl" icon={cilTrash} className="deleteBtn" onClick={handleClick} />}</p>
                </div>
            </div>
            {isModalOpen && (
                <Modal item={item} base64Image={base64Image} onClose={handleCloseModal} />
            )}
        </>
    );
};

const TopStories = () => {
    const [topStories, setTopStories] = useState([]);

    const getTopStories = async () => {
        try {
            const response1 = await fetch(`${config.BOTS_V2_API}/get_all_articles?limit=200`);
            const data1 = await response1.json();

            if (response1.ok) {
                const topStories = data1.data.filter(article => article.is_top_story);
                console.log(topStories)
                setTopStories(topStories);
            } else {
                console.error('Error fetching:', data1);
            }
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    const handleDelete = async (article_id) => {
        try {
            const response = await fetch(`${config.BOTS_V2_API}/api/update/top-story/${article_id}`, {
                method: 'PUT',  
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
                getTopStories();
            } else {
                console.error('Error updating:', data);
                Swal.fire({
                    icon: "error",
                    title: data.error,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error('Error updating:', error);
            Swal.fire({
                icon: "error",
                title: error,
                showConfirmButton: false,
            });
        }
    };

    useEffect(() => {
        getTopStories();
    }, []);

    return (
        <div className='alltopStoriesmain'>
            <h3 className='alltopStoriesTitle'>Top Stories</h3>
            <br />
            {topStories && topStories.length > 0 ?
                <div className='card-deck'>
                    {topStories.map(item => (
                        <Item key={item.article_id} item={item} base64Image={item.image} onDelete={handleDelete} />
                    ))}
                </div> : <span>No Top Stories yet</span>
            }
        </div>
    );
};

export default TopStories;
