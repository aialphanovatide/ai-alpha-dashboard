import React, { useState, useEffect } from "react";
import RichTextEditor from "../helpers/textEditor/textEditor";
import { Modal, Button } from "react-bootstrap";
import "./index.css";

const EditModal = ({ item, onSave, onClose, section_id }) => {
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    setEditedContent(item.analysis || item.narrative_trading);
  }, [item]);

  const handleSave = async () => {
    await onSave(item.analysis_id, section_id, editedContent);
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
        <Button variant="danger" onClick={onClose}>
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
