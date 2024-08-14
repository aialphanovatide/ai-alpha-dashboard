import React, { useEffect, useState } from 'react'
import config from "../../config";
import { formatDateTime } from 'src/utils';

// created_at
// auth0id
// email
// nickname
// picture

const UsersList = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();
      if (data && data.data) {
        setUsers(data.data);
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);


  return (
    <div>
      <ul>
        {
          users?.map((user, index) => 
            (<li key={index}>
              <span>{index + 1}, {formatDateTime(user.created_at)}, {user.auth0id}, {user.email}, {user.nickname}, {user.picture}</span>
            </li>)
          )
        }
      </ul>
    </div>
  )
}

export default UsersList