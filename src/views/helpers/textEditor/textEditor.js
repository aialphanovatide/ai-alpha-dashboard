import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './textEditor.css'

const RichTextEditor = ({ handleImageSelect, images, onContentChange, success, onSuccess }) => {
  const [content, setContent] = useState('');
  
  useEffect(()=>{
    setContent('')
  }, [images])


  const handleQuillChange = (value) => {
    // Process the content and replace image markers with actual images
    let updatedContent = value;

    images.forEach((image, index) => {
      const marker = `{image ${index + 1}}`;
      updatedContent = updatedContent.replace(marker, `<img  src="${image.previewUrl}" alt="${image.file.name}" />`);
    });

    setContent(updatedContent);
    onContentChange(updatedContent);
  };

  // console.log('content: ', content)
  // console.log('images: ', images)


  useEffect(()=>{
    if (success){
      setContent('')
    }
    onSuccess(false)
  }, [success])

  
  const formats = [
    'header',
    'height',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'color',
    'bullet',
    'indent',
    'link',
    'image',
    'align',
    'size',
  ]

  const modules = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, { align: [] }],
      [
        {
          color: [
            '#000000',
            '#e60000',
            '#ff9900',
            '#ffff00',
            '#008a00',
            '#0066cc',
            '#9933ff',
            '#ffffff',
            '#facccc',
            '#ffebcc',
            '#ffffcc',
            '#cce8cc',
            '#cce0f5',
            '#ebd6ff',
            '#bbbbbb',
            '#f06666',
            '#ffc266',
            '#ffff66',
            '#66b966',
            '#66a3e0',
            '#c285ff',
            '#888888',
            '#a10000',
            '#b26b00',
            '#b2b200',
            '#006100',
            '#0047b2',
            '#6b24b2',
            '#444444',
            '#5c0000',
            '#663d00',
            '#666600',
            '#003700',
            '#002966',
            '#3d1466',
            'custom-color',
          ],
        },
      ],
    ],
  }

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      placeholder="Write your content..."
      onChange={handleQuillChange}
      value={content}
      className='textEditor'
    />
  );
};

export default RichTextEditor;
