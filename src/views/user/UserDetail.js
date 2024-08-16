import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "src/config";
import userImg from "src/assets/images/defaultUserImg.jpg";
import "./UserDetail.css";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilClock } from "@coreui/icons";

const UserDetail = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState([]);

  const getUser = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/user?user_id=${user_id}`,
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
    <>
      <div className="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 user-info-container">
        <img className="user-img" src={user.picture || userImg} />
        <CIcon
          icon={cilCheckCircle}
          className="text-info"
          size="xxl"
          style={{ visibility: user.email_verified ? "visible" : "hidden" }}
        />
        <div className="user-info-subcontainer bg-red-100">
          <p className="name">{user.nickname}</p>
          <p className="email">{user.email}</p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>ID:</strong> {user.auth0id}
          </p>
        </div>
      </div>
      <div className="mt-4 rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 user-plans-container">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white plans-title">
          Purchased Plans
        </h3>
        {user.purchased_plans?.length > 0 ? (
          user.purchased_plans.map((plan, index) => (
            <div
              key={index}
              className="mt-2 rounded border border-gray-600 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
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
                <CIcon icon={cilClock} />{" "}
                {new Date(plan.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300  font-bold">
            No plans purchased
          </p>
        )}
      </div>
    </>
  );
};

export default UserDetail;
