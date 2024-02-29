import React from "react";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

const ScheduledJob = ({ job, onDelete }) => {
  // Parse title from the HTML string
  const title = job.args.match(/<p>(.*?)<\/p>/)[1];

  // Extract date and time from job.trigger
  const dateMatch = job.trigger.match(/\[(.*?)\]/);
  const nextRunDateTime = dateMatch
    ? dateMatch[1].replace(/ -\d{2}$/, "")
    : "Unknown";

  const handleDeleteClick = () => {
    // Call the onDelete function passed as a prop
    onDelete(job.id); // Assuming job has an id property
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
        style={{ position: "absolute", right: "20%"}}
        className="deleteBtn"
        onClick={handleDeleteClick}
      />
    </div>
  );
};

export default ScheduledJob;
