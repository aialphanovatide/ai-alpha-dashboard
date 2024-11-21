import { cilNewspaper } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CAlert } from "@coreui/react";
import React from "react";
import { useSocket } from "src/contexts/socketContext";

const NotificationsList = () => {
  const { notifications } = useSocket();

  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    const units = [
      { name: "Y", seconds: 31536000 },
      { name: "M", seconds: 2592000 },
      { name: "D", seconds: 86400 },
      { name: "H", seconds: 3600 },
      { name: "M", seconds: 60 },
      { name: "S", seconds: 1 },
    ];

    for (let unit of units) {
      const interval = Math.floor(diff / unit.seconds);
      if (interval >= 1) {
        return `${interval}${unit.name}`;
      }
    }
    return "Just now";
  };

  return (
    <div>
      <h3>Notifications</h3>
      {notifications.map((notif, index) => (
        <div
          key={index}
          style={{
            padding: 10,
            borderTop: "1.5px solid #e5e5e5",
          }}
        >
          <strong>{notif.title}</strong>
          <p style={{marginTop: 10}}>{notif.message}</p>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', color: 'gray'}}>
            <div>
              <CIcon icon={cilNewspaper} style={{color: 'black', marginRight: 5}} />
              <span>{notif.type || "Content"}</span>
            </div>
            <span>{timeAgo(notif.time)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;
