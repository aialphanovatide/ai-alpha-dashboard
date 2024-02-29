import React from "react";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

const ScheduledJob = ({ job, onDelete }) => {
  // Dividir job.args en dos partes usando la coma como delimitador
  const [, htmlString] = job.args.split(',');

  // Eliminar espacios en blanco al principio y al final de la cadena HTML
  const trimmedHtmlString = htmlString.trim();

  // Crear un nuevo parser HTML
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(trimmedHtmlString, "text/html");

  // Obtener el título del elemento HTML
  const titleElement = parsedHtml.querySelector("p");
  const title = titleElement ? titleElement.textContent : "";

  // Extraer fecha y hora de job.trigger
  const dateMatch = job.trigger.match(/\[(.*?)\]/);
  const nextRunDateTime = dateMatch
    ? dateMatch[1].replace(/ -\d{2}$/, "")
    : "Unknown";

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
        style={{ position: "absolute", right: "20%"}}
        className="deleteBtn"
        onClick={handleDeleteClick}
      />
    </div>
  );
};

export default ScheduledJob;
