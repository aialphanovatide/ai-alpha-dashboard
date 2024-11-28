import React from "react";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

const ScheduledJob = ({ job, onDelete }) => {
  const dateMatch = job.trigger.match(/\[(.*?)\]/);
  const nextRunDateTime = dateMatch
    ? dateMatch[1].replace(/ -\d{2}$/, "")
    : "Unknown";

  const titleMatch = job.args.match(/Title:\s*(.*?)\\r\\n/);
  const title = titleMatch ? titleMatch[1] : "Unknown";

  const handleDeleteClick = () => {
    onDelete(job.id);
  };

  return (
    <div className="titleSched">
      <h5 className="schedtitl">{title}</h5>
      <p className="pSchedule">
        <b>Run Date-Time:</b> {nextRunDateTime}
      </p>
      <CIcon
        size="xxl"
        icon={cilTrash}
        style={{ position: "absolute", right: "20%" }}
        className="deleteBtn"
        onClick={handleDeleteClick}
      />
    </div>
  );
};

export default ScheduledJob;
