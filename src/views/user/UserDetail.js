import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import config from 'src/config';
import userImg from "src/assets/images/defaultUserImg.jpg";
import "./UserDetail.css"

const UserDetail = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState([]);

  const getUser = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/user?user_id=${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await response.json();
      if (data && data.data) {
        setUser(data.data);
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 user-detail-container">
      <div className="name-img-container">
          <img
            className="user-img"
            src={user.picture || userImg }
            alt={user.nickname}
          />
        <div className='name-email-subcontainer'>
          <p>{user.nickname}</p>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-600 dark:text-gray-300"><strong>User ID:</strong> {user.auth0id}</p>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>Email Verified:</strong> {user.email_verified ? "Yes" : "No"}
        </p>
        <p className="text-gray-600 dark:text-gray-300"><strong>Provider:</strong> {user.provider}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Purchased Plans
        </h3>
        {user.purchased_plans?.length > 0 ? (
          user.purchased_plans.map((plan, index) => (
            <div
              key={index}
              className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <p className="text-gray-800 dark:text-gray-200">
              <strong>Plans:</strong> {plan.reference_name}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
              <strong>Subscribed:</strong> {plan.is_subscribed ? "Yes" : "No"}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
              <strong>Price:</strong> ${plan.price}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
              <strong>Created at:</strong> {new Date(plan.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No plans purchased</p>
        )}
      </div>
    </div>
  )
}

export default UserDetail

// {
//   "auth0id": "apple|000793.c3c1fa75a11947229716a4d4948d7217.1628",
//   "created_at": "Mon, 05 Aug 2024 19:06:06 GMT",
//   "email": "amanblue@gmail.com",
//   "email_verified": "true",
//   "full_name": null,
//   "nickname": "amanblue",
//   "picture": null,
//   "provider": "apple",
//   "purchased_plans": [
//       {
//           "created_at": "Tue, 13 Aug 2024 20:50:26 GMT",
//           "is_subscribed": true,
//           "price": 149,
//           "product_id": 12,
//           "reference_name": "founders_14999_m1_nofreetrial"
//       }
//   ],
//   "user_id": 82
// }