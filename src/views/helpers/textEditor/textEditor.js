import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./textEditor.css";

const RichTextEditor = ({
  handleImageSelect,
  images,
  onContentChange,
  success,
  onSuccess,
}) => {
  const [content, setContent] = useState("");
  const [quillRef, setQuillRef] = useState(null);

  useEffect(() => {
    setContent("");
  }, [images]);

  useEffect(() => {
    if (success) {
      setContent("");
      onSuccess(false);
    }
  }, [success, onSuccess]);

  const handleQuillChange = (value) => {
    let updatedContent = value;

    if (images && images.length > 0) {
      images.forEach((image, index) => {
        const marker = `{image ${index + 1}}`;
        updatedContent = updatedContent.replace(
          marker,
          `<img src="${image.previewUrl}" alt="${image.file.name}" />`,
        );
      });
    }

    setContent(updatedContent);
    onContentChange(updatedContent);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const resizedBase64 = canvas.toDataURL("image/jpeg");

          const quill = quillRef.getEditor();
          const index = quill.getSelection()?.index || 0;
          quill.insertEmbed(index, "image", resizedBase64, "user");
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "size",
  ];

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] },
      ],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
      ],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <div
      className="textEditorContainer"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleDrop}
    >
      <ReactQuill
        ref={(el) => {
          setQuillRef(el);
        }}
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder="Write your content..."
        onChange={handleQuillChange}
        value={content}
        className="textEditor"
      />
    </div>
  );
};

export default RichTextEditor;
