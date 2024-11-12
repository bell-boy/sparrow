'use client';
import React, {useState} from 'react';
import { useDropzone } from 'react-dropzone';

const HomePage: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPdfFile(file);
      uploadPdf(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
  });

  // Function to upload PDF to the Flask server
  const uploadPdf = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(data.message);
        console.log('File uploaded successfully:', data);
      } else {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.error}`);
        console.error('Upload failed:', errorData);
      }
    } catch (error) {
      setUploadStatus('Error: Could not upload file');
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-gray-200">
      {/* Header Box */}
      <header className="w-full bg-[#1a1a1a] text-white py-6 px-8 flex justify-start items-center shadow-md border-b border-gray-700">
        <h1 className="text-5xl font-extrabold font-[Poppins]">Sparrow</h1>
      </header>

      {/* Explanatory Text */}
      <div className="px-8 py-4 text-gray-400 text-lg max-w-2xl mx-auto">
        <p>
          Welcome to Sparrow! This application allows you to convert PDF documents
          into audio files. Simply drag and drop your PDF file into the drop zone
          below, or click to select a file from your device. Sparrow will process
          the file and provide an audiobook version that you can listen to on the go.
        </p>
      </div>

      {/* Centered Drop Box */}
      <div className="flex-grow flex items-center justify-center">
        <div
          {...getRootProps({
            className: `flex items-center justify-center w-3/4 max-w-md h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              isDragActive
                ? 'border-purple-500 bg-[#2a2a2a] shadow-lg'
                : 'border-gray-600 bg-[#1a1a1a] shadow-md'
            }`,
          })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-lg text-purple-400">Drop the file here...</p>
          ) : (
            <p className="text-lg text-gray-400">
              Drag & drop a PDF file here, or click to select one
            </p>
          )}
        </div>
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <div className="px-8 py-4 text-gray-300 max-w-2xl mx-auto">
          <p>{uploadStatus}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
