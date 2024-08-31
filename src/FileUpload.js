// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onUpload = async () => {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post(`http://localhost:4000/api/upload`, formData);
//       setMessage(response.data.message);
//     } catch (error) {
//       setMessage('Error uploading file');
//     }
//   };

//   return (
//     <div>
//       <h2>Upload File</h2>
//       <input type="file" onChange={onFileChange} />
//       <button onClick={onUpload}>Upload</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default FileUpload;


import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Typography, Paper, CircularProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: ['.csv', '.xlsx'],
    onDrop: (files) => {
      handleFileUpload(files[0]);
    },
    multiple: false,
  });

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:4000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedFileName(file.name);
      console.log('Upload response:', response.data);
    } catch (error) {
      setUploadError('Failed to upload file. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const filePreview = acceptedFiles.map((file) => (
    <Typography key={file.name}>{file.name}</Typography>
  ));

  return (
    <Paper
      {...getRootProps({ className: 'dropzone' })}
      elevation={3}
      style={{ padding: '20px', textAlign: 'center', border: '2px dashed #1976d2', borderRadius: '8px' }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon style={{ fontSize: '40px', color: '#1976d2' }} />
      <Typography variant="h6" gutterBottom>
        Drag & Drop your CSV/XLSX file here, or click to select
      </Typography>
      {uploading && <CircularProgress />}
      {filePreview}
      {uploadError && <Typography color="error">{uploadError}</Typography>}
      {uploadedFileName && <Typography color="success">File uploaded: {uploadedFileName}</Typography>}
    </Paper>
  );
};

export default FileUpload;
