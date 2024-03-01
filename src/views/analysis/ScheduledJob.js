import React from "react";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

const ScheduledJob = ({ job, onDelete }) => {
  console.log("job,", job);

  // Extraer fecha y hora de job.trigger
  const dateMatch = job.trigger.match(/\[(.*?)\]/);
  const nextRunDateTime = dateMatch
    ? dateMatch[1].replace(/ -\d{2}$/, "")
    : "Unknown";

  // Extraer título de job.args
  const titleMatch = job.args.match(/Title:\s*(.*?)\\r\\n/);
  const title = titleMatch ? titleMatch[1] : "Unknown";

  const handleDeleteClick = () => {
    // Llamar a la función onDelete pasada como prop
    onDelete(job.id); // Suponiendo que job tiene una propiedad id
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
