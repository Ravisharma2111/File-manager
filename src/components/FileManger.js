import React, { useState } from 'react';
import { FaFolder, FaFile, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const fileManagerData = {
  name: 'root',
  type: 'folder',
  id: uuidv4(),
  children: [
    {
      name: 'Documents',
      type: 'folder',
      id: uuidv4(),
      children: [
        { name: 'document1.txt', type: 'file', id: uuidv4() },
        { name: 'document2.txt', type: 'file', id: uuidv4() },
      ],
    },
    {
      name: 'Pictures',
      type: 'folder',
      id: uuidv4(),
      children: [
        { name: 'picture1.jpg', type: 'file', id: uuidv4() },
        { name: 'picture2.png', type: 'file', id: uuidv4() },
      ],
    },
    { name: 'music.mp3', type: 'file', id: uuidv4() },
  ],
};

const DirectoryTree = ({ directory, onFileClick }) => (
  <ul>
    <li key={directory.id}>
      <span>
        {directory.type === 'folder' && <FaFolder />}
        {directory.type === 'file' && <FaFile />}
        {directory.name}
      </span>
      {directory.children && directory.children.length > 0 && (
        <ul>
          {directory.children.map((child) => (
            <li key={child.id}>
              <span onClick={() => onFileClick(child)}>
                {child.type === 'folder' && <FaFolder />}
                {child.type === 'file' && <FaFile />}
                {child.name}
              </span>
              {child.type === 'folder' && <DirectoryTree directory={child} onFileClick={onFileClick} />}
            </li>
          ))}
        </ul>
      )}
    </li>
  </ul>
);

const FileManger = () => {
  const [fileSystem, setFileSystem] = useState(fileManagerData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setError('');
  };
  const handleCreateFile = () => {
    if (newFileName.trim() === '') {
      setError('File name cannot be empty.');
      return;
    }

    const newFile = {
      name: newFileName,
      type: 'file',
      id: uuidv4(),
    };

    setFileSystem((prevFileSystem) => {
      const updatedFileSystem = { ...prevFileSystem };
      const currentDirectory = findDirectoryById(updatedFileSystem, selectedFile.id);
      currentDirectory.children.push(newFile);
      return updatedFileSystem;
    });

    setNewFileName('');
    setError('');
  };
  const handleCreateFolder = () => {
    if (newFileName.trim() === '') {
      setError('Folder name cannot be empty.');
      return;
    }

    const newFolder = {
      name: newFileName,
      type: 'folder',
      id: uuidv4(),
      children: [],
    };

    setFileSystem((prevFileSystem) => {
      const updatedFileSystem = { ...prevFileSystem };
      const currentDirectory = findDirectoryById(updatedFileSystem, selectedFile.id);
      currentDirectory.children.push(newFolder);
      return updatedFileSystem;
    });

    setNewFileName('');
    setError('');
  };

  const handleRenameFile = () => {
    if (newFileName.trim() === '') {
      setError('New name cannot be empty.');
      return;
    }

    setFileSystem((prevFileSystem) => {
      const updatedFileSystem = { ...prevFileSystem };
      const currentFile = findFileById(updatedFileSystem, selectedFile.id);
      currentFile.name = newFileName;
      return updatedFileSystem;
    });

    setNewFileName('');
    setSelectedFile(null);
    setError('');
  };

  const handleDeleteFile = () => {
    setFileSystem((prevFileSystem) => {
      const updatedFileSystem = { ...prevFileSystem };
      const parentDirectory = findParentDirectory(updatedFileSystem, selectedFile.id);
      parentDirectory.children = parentDirectory.children.filter((file) => file.id !== selectedFile.id);
      return updatedFileSystem;
    });

    setNewFileName('');
    setSelectedFile(null);
    setError('');
  };


  const findDirectoryById = (directory, id) => {
    if (directory.id === id) return directory;

    for (const child of directory.children) {
      if (child.type === 'folder') {
        const foundDirectory = findDirectoryById(child, id);
        if (foundDirectory) return foundDirectory;
      }
    }

    return null;
  };

  const findFileById = (directory, id) => {
    for (const child of directory.children) {
      if (child.id === id) return child;
      if (child.type === 'folder') {
        const foundFile = findFileById(child, id);
        if (foundFile) return foundFile;
      }
    }

    return null;
  };


  const findParentDirectory = (directory, id) => {
    for (const child of directory.children) {
      if (child.children.some((file) => file.id === id)) return child;
      if (child.type === 'folder') {
        const foundDirectory = findParentDirectory(child, id);
        if (foundDirectory) return foundDirectory;
      }
    }

    return null;
  };

  return (
    <div className="file-explorer">
      <div className="directory-tree">
        <DirectoryTree directory={fileSystem} onFileClick={handleFileClick} />
      </div>
      <div className="file-content">
        <div className="file-actions">
        <input
        type="text"
        placeholder="New File/Folder Name"
        value={newFileName}
        onChange={(e) => setNewFileName(e.target.value)}
      />
      <button onClick={handleCreateFile}>
        <FaPlus /> Create File
      </button>
      <button onClick={handleCreateFolder}>
        <FaPlus /> Create Folder
      </button>
      {selectedFile && (
        <>
          <button onClick={handleRenameFile}>
            <FaEdit /> Rename
          </button>
          <button onClick={handleDeleteFile}>
            <FaTrash /> Delete
          </button>
        </>
      )}
      {error && <p className="error">{error}</p>}
        </div>
        <div className="file-details">
          {selectedFile && (
            <div>
              <h3>File Details</h3>
              <p>Name: {selectedFile.name}</p>
              <p>Type: {selectedFile.type}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManger;
