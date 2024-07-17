import React, { useState, useEffect } from "react";
import RichTextEditor from "../helpers/textEditor/textEditor";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import "./analysis.css";

const EditModal = ({ item, onSave, onClose, fetchAnalysis }) => {
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    // Cuando cambia el contenido del ítem, actualiza el estado del contenido editado
    setEditedContent(item.narrative_trading);
  }, [item]);

  const handleSave = async () => {
    // Marca la función como async
    onSave(item.analysis_id, editedContent);

    Swal.fire({
      icon: "success",
      title: "Analysis updated successfully",
      showConfirmButton: false,
      timer: 1000,
    });

    // Aquí podrías llamar a la función fetchAnalysis si es necesario
    await fetchAnalysis();

    onClose();
  };

  const handleContentChange = (content) => {
    setEditedContent(content);
  };

  return (
    <Modal size={'xl'} show={true} onHide={onClose} className="editModal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Analysis</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RichTextEditor
          initialContent={editedContent} 
          onContentChange={handleContentChange} 
          className="editContentArea"
        />
      </Modal.Body>
      <br />
      <br />
      <br />
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
