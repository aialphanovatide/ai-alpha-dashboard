    import React, { useState, useEffect } from "react";
    import RichTextEditor from "../helpers/textEditor/textEditor";
    import { Modal, Button } from "react-bootstrap";
    import "./analysis.css";

    const EditModal = ({ item, onSave, onClose }) => {
    const [editedContent, setEditedContent] = useState("");

    useEffect(() => {
        // Cuando cambia el contenido del ítem, actualiza el estado del contenido editado
        setEditedContent(item.analysis);
    }, [item]);

    const handleSave = () => {
        onSave(item.analysis_id, editedContent);
        console.log("contenido por enviar:", editedContent);
        onClose();
    };

    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;   
        return tmp.textContent || tmp.innerText || "";
    };

    const handleContentChange = (content) => {
        setEditedContent(content);  
    };

    return (
        <Modal show={true} onHide={onClose} className="editModal">
        <Modal.Header closeButton>
            <Modal.Title>Edit Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <RichTextEditor
            initialContent={editedContent} // Pasar el contenido a editar como initialContent
            onContentChange={handleContentChange} // No necesitas pasar value ni placeholder aquí
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
