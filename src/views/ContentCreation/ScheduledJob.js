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
      <h5>{title}</h5>
      <span>
        <b>Run Date-Time:</b> {nextRunDateTime}
      </span>
      <button onClick={handleDeleteClick}>
        <CIcon size="lg" icon={cilTrash} />
      </button>
    </div>
  );
};

export default ScheduledJob;
