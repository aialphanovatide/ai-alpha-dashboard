import React from "react";
import Card from "src/components/commons/Card";
import { formatDateTime } from "src/utils";

const ScheduledJob = ({ job, onDelete }) => {
  const handleDeleteClick = () => {
    onDelete(job.id);
  };

  return (
    <Card
      content={job.content}
      title={job.title}
      image={job.image_url}
      date={formatDateTime(job.scheduled_time)}
      onDelete={handleDeleteClick}
    />
  );
};

export default ScheduledJob;
