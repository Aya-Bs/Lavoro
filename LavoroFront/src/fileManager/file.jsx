import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';

const File = () => {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareFileId, setShareFileId] = useState(null);
  const [usersToShare, setUsersToShare] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [makePublic, setMakePublic] = useState(false);
  const [permission, setPermission] = useState('view');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [fileDetails, setFileDetails] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const navigate = useNavigate();

  // Fetch user info, files, and all users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        // Fetch user info
        const userResponse = await axios.get("http://localhost:3000/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data);

        // Fetch user's files
        const filesResponse = await axios.get("http://localhost:3000/files/shared", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setFiles(filesResponse.data.ownedFiles);
        setSharedFiles(filesResponse.data.sharedFiles);

        // Fetch all users for sharing
        const usersResponse = await axios.get("http://localhost:3000/users/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Access the nested array correctly
        const usersArray = usersResponse.data.data;
        setAllUsers(usersArray.filter(u => u._id !== userResponse.data._id));
        
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Handle file upload via Dropzone
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:3000/files/upload", 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setFiles(prev => [...prev, response.data.file]);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert('Failed to upload file');
    }
  };

  // Handle file download
  const handleDownload = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      window.open(
        `http://localhost:3000/files/${fileId}?download=true`,
        '_blank'
      );
    } catch (err) {
      console.error("Error downloading file:", err);
      alert('Failed to download file');
    }
  };

  // Open share modal
  const openShareModal = (fileId) => {
    setShareFileId(fileId);
    setShowShareModal(true);
  };

  // Handle file sharing
  const handleShare = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/files/share/${shareFileId}`,
        { 
          userIds: usersToShare,
          permission,
          makePublic 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('File shared successfully');
      setShowShareModal(false);
      setUsersToShare([]);
      setMakePublic(false);
      
      // Refresh files list
      const filesResponse = await axios.get("http://localhost:3000/files/shared", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(filesResponse.data.ownedFiles);
      setSharedFiles(filesResponse.data.sharedFiles);
    } catch (err) {
      console.error("Error sharing file:", err);
      alert('Failed to share file');
    }
  };

  // Toggle user selection for sharing
  const toggleUserSelection = (userId) => {
    setUsersToShare(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  // Filter files based on search term and active tab
  const filteredFiles = () => {
    let result = [];
    if (activeTab === 'all') {
      result = [...files, ...sharedFiles];
    } else if (activeTab === 'owned') {
      result = files;
    } else if (activeTab === 'shared') {
      result = sharedFiles;
    }

    return result.filter(file => 
      file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.file_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Filter files by category
  const filterFilesByCategory = (category) => {
    return filteredFiles().filter(file => file.file_type === category);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'image':
        return <i className="ri-image-line fs-20"></i>;
      case 'video':
        return <i className="ri-video-line fs-20"></i>;
      case 'audio':
        return <i className="ri-music-2-line fs-20"></i>;
      case 'document':
        return <i className="ri-file-text-line fs-20"></i>;
      case 'archive':
        return <i className="ri-archive-line fs-20"></i>;
      default:
        return <i className="ri-file-line fs-20"></i>;
    }
  };

  // Get file details
  const getFileDetails = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/files/${fileId}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFileDetails(response.data.file);
      setShowFileDetails(true);
    } catch (err) {
      console.error("Error fetching file details:", err);
      alert('Failed to fetch file details');
    }
  };

  // Handle create folder
  const handleCreateFolder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:3000/files/folders/create",
        { name: newFolderName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Folder created successfully');
      setNewFolderName('');
      // You might want to refresh your folders list here
    } catch (err) {
      console.error("Error creating folder:", err);
      alert('Failed to create folder');
    }
  };

  // Open category modal
  const openCategoryModal = (category) => {
    setCurrentCategory(category);
    setShowCategoryModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <link rel="stylesheet" href="../assets/libs/dropzone/dropzone.css" />

      <div className="container-fluid">
        {/* Page Header */}
        <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
          <div>
            <nav>
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item">
                  <a href="javascript:void(0);">Pages</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  File Manager
                </li>
              </ol>
            </nav>
            <h1 className="page-title fw-medium fs-18 mb-0">File Manager</h1>
          </div>
          <div className="btn-list">
            <button className="btn btn-white btn-wave">
              <i className="ri-filter-3-line align-middle me-1 lh-1" /> Filter
            </button>
            <button className="btn btn-primary btn-wave me-0">
              <i className="ri-share-forward-line me-1" /> Share
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Sidebar */}
          <div className="col-xxl-3">
            <div className="row">
              <div className="col-xl-12">
                <div className="card custom-card">
                  <div className="d-flex p-3 flex-wrap gap-2 align-items-center justify-content-between border-bottom">
                    <div className="flex-fill">
                      <h6 className="fw-medium mb-0">File Manager</h6>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3 p-3 border-bottom border-block-end-dashed">
                   
                    <span className="avatar avatar-xl online">
            {user.image ? (
              <img
                src={
                  user.image.startsWith('http') || user.image.startsWith('https')
                    ? user.image // Use as-is if it's already a full URL
                    : `http://localhost:3000${user.image}` // Prepend server URL if relative
                }
                alt="Profile"
                
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100";
                }}
              />
            ) : (
              <p>No profile image uploaded.</p>
            )}
          </span>
                    <div className="main-profile-info">
                      <h6 className="fw-semibold mb-1">{user?.firstName} {user?.lastName}</h6>
                      <p className="text-muted fs-11 mb-2">{user?.role?.RoleName}</p>
                      <p className="mb-0">{user?.email}</p>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled files-main-nav" id="files-main-nav">
                      <li className="px-0 pt-0">
                        <span className="fs-12 text-muted">My Files</span>
                      </li>
                      <li className={`files-type ${activeTab === 'all' ? 'active' : ''}`}>
                        <a href="javascript:void(0)" onClick={() => setActiveTab('all')}>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="ri-folder-2-line fs-16" />
                            </div>
                            <span className="flex-fill text-nowrap">
                              All Files
                            </span>
                            <span className="badge bg-primary">{files.length + sharedFiles.length}</span>
                          </div>
                        </a>
                      </li>
                      <li className={`files-type ${activeTab === 'owned' ? 'active' : ''}`}>
                        <a href="javascript:void(0)" onClick={() => setActiveTab('owned')}>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="ri-history-fill fs-16" />
                            </div>
                            <span className="flex-fill text-nowrap">
                              My Files
                            </span>
                            <span className="badge bg-primary">{files.length}</span>
                          </div>
                        </a>
                      </li>
                      <li className={`files-type ${activeTab === 'shared' ? 'active' : ''}`}>
                        <a href="javascript:void(0)" onClick={() => setActiveTab('shared')}>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="ri-share-forward-line fs-16" />
                            </div>
                            <span className="flex-fill text-nowrap">
                              Shared Files
                            </span>
                            <span className="badge bg-primary">{sharedFiles.length}</span>
                          </div>
                        </a>
                      </li>
                      <li className="px-0 pt-3">
                        <span className="fs-12 text-muted">Upload File</span>
                      </li>
                      <li className="p-3 border border-dashed">
                        <Dropzone onDrop={onDrop} multiple={false}>
                          {({getRootProps, getInputProps}) => (
                            <div {...getRootProps()} className="dropzone bg-light">
                              <input {...getInputProps()} />
                              <p>Drag & drop a file here, or click to select</p>
                              <em>(Only one file will be accepted)</em>
                            </div>
                          )}
                        </Dropzone>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main File Area */}
          <div className="col-xxl-6">
            <div className="card custom-card overflow-hidden">
              <div className="card-body p-0">
                <div className="file-manager-folders">
                  <div className="d-flex p-3 flex-wrap gap-2 align-items-center justify-content-between border-bottom">
                    <div className="flex-fill">
                      <h6 className="fw-medium mb-0">All Folders</h6>
                    </div>
                    <div className="d-flex gap-2 flex-lg-nowrap flex-wrap justify-content-sm-end w-75">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control w-50"
                          placeholder="Search File"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                          className="btn btn-primary-light"
                          type="button"
                        >
                          <i className="ri-search-line" />
                        </button>
                      </div>
                      <button
                        className="btn btn-primary btn-w-md d-flex align-items-center justify-content-center btn-wave waves-light text-nowrap"
                        data-bs-toggle="modal"
                        data-bs-target="#create-folder"
                      >
                        <i className="ri-add-circle-line align-middle me-1" />
                        Create Folder
                      </button>
                      {/* Create Folder Modal */}
                      <div
                        className="modal fade"
                        id="create-folder"
                        tabIndex={-1}
                        aria-labelledby="create-folder"
                        data-bs-keyboard="false"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h6 className="modal-title">Create Folder</h6>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              />
                            </div>
                            <div className="modal-body">
                              <label htmlFor="create-folder1" className="form-label">
                                Folder Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="create-folder1"
                                placeholder="Folder Name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                              />
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-sm btn-icon btn-light"
                                data-bs-dismiss="modal"
                              >
                                <i className="ri-close-fill" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={handleCreateFolder}
                                data-bs-dismiss="modal"
                              >
                                Create
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Access Folders */}
                  <div className="p-3 file-folders-container">
                    <div className="d-flex mb-3 align-items-center justify-content-between">
                      <p className="mb-0 fw-medium fs-14">Quick Access</p>
                      <a
                        href="javascript:void(0);"
                        className="fs-12 text-muted fw-medium"
                      >
                        View All
                        <i className="ti ti-arrow-narrow-right ms-1" />
                      </a>
                    </div>
                    <div className="row mb-3">
                      {/* Images Folder */}
                      <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
                        <div 
                          className="card custom-card shadow-none border"
                          onClick={() => openCategoryModal('image')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                              <div className="main-card-icon primary">
                                <div className="avatar avatar-md bg-primary-transparent border border-primary border-opacity-10">
                                  <div className="avatar avatar-sm text-primary">
                                    <i className="ri-image-line fs-24" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex-fill">
                                <a href="javascript:void(0);" className="d-block fw-medium">
                                  Images
                                </a>
                                <span className="fs-12 text-muted">
                                  {Math.round(files.filter(f => f.file_type === 'image').length / files.length * 100 || 0)}% Used
                                </span>
                              </div>
                              <div className="text-end">
                                <span className="fw-medium">
                                  {files.filter(f => f.file_type === 'image').length} files
                                </span>
                                <span className="d-block fs-12 text-muted">
                                  {formatFileSize(files.filter(f => f.file_type === 'image').reduce((acc, file) => acc + file.file_size, 0))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Videos Folder */}
                      <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
                        <div 
                          className="card custom-card shadow-none border"
                          onClick={() => openCategoryModal('video')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                              <div className="main-card-icon primary1">
                                <div className="avatar avatar-md bg-primary1-transparent border border-primary1 border-opacity-10">
                                  <div className="avatar avatar-sm text-primary1">
                                    <i className="ri-video-line fs-24" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex-fill">
                                <a href="javascript:void(0);" className="d-block fw-medium">
                                  Videos
                                </a>
                                <span className="fs-12 text-muted">
                                  {Math.round(files.filter(f => f.file_type === 'video').length / files.length * 100 || 0)}% Used
                                </span>
                              </div>
                              <div className="text-end">
                                <span className="fw-medium">
                                  {files.filter(f => f.file_type === 'video').length} files
                                </span>
                                <span className="d-block fs-12 text-muted">
                                  {formatFileSize(files.filter(f => f.file_type === 'video').reduce((acc, file) => acc + file.file_size, 0))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Documents Folder */}
                      <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
                        <div 
                          className="card custom-card shadow-none border"
                          onClick={() => openCategoryModal('document')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                              <div className="main-card-icon secondary">
                                <div className="avatar avatar-md bg-secondary-transparent border border-secondary border-opacity-10">
                                  <div className="avatar avatar-sm text-secondary">
                                    <i className="ri-file-text-line fs-24" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex-fill">
                                <a href="javascript:void(0);" className="d-block fw-medium">
                                  Documents
                                </a>
                                <span className="fs-12 text-muted">
                                  {Math.round(files.filter(f => f.file_type === 'document').length / files.length * 100 || 0)}% Used
                                </span>
                              </div>
                              <div className="text-end">
                                <span className="fw-medium">
                                  {files.filter(f => f.file_type === 'document').length} files
                                </span>
                                <span className="d-block fs-12 text-muted">
                                  {formatFileSize(files.filter(f => f.file_type === 'document').reduce((acc, file) => acc + file.file_size, 0))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Audio Folder */}
                      <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
                        <div 
                          className="card custom-card shadow-none border"
                          onClick={() => openCategoryModal('audio')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                              <div className="main-card-icon success">
                                <div className="avatar avatar-md bg-success-transparent border border-success border-opacity-10">
                                  <div className="avatar avatar-sm text-success">
                                    <i className="ri-music-2-line fs-24" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex-fill">
                                <a href="javascript:void(0);" className="d-block fw-medium">
                                  Audio
                                </a>
                                <span className="fs-12 text-muted">
                                  {Math.round(files.filter(f => f.file_type === 'audio').length / files.length * 100 || 0)}% Used
                                </span>
                              </div>
                              <div className="text-end">
                                <span className="fw-medium">
                                  {files.filter(f => f.file_type === 'audio').length} files
                                </span>
                                <span className="d-block fs-12 text-muted">
                                  {formatFileSize(files.filter(f => f.file_type === 'audio').reduce((acc, file) => acc + file.file_size, 0))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Archives Folder */}
                      <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
                        <div 
                          className="card custom-card shadow-none border"
                          onClick={() => openCategoryModal('archive')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                              <div className="main-card-icon warning">
                                <div className="avatar avatar-md bg-warning-transparent border border-warning border-opacity-10">
                                  <div className="avatar avatar-sm text-warning">
                                    <i className="ri-archive-line fs-24" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex-fill">
                                <a href="javascript:void(0);" className="d-block fw-medium">
                                  Archives
                                </a>
                                <span className="fs-12 text-muted">
                                  {Math.round(files.filter(f => f.file_type === 'archive').length / files.length * 100 || 0)}% Used
                                </span>
                              </div>
                              <div className="text-end">
                                <span className="fw-medium">
                                  {files.filter(f => f.file_type === 'archive').length} files
                                </span>
                                <span className="d-block fs-12 text-muted">
                                  {formatFileSize(files.filter(f => f.file_type === 'archive').reduce((acc, file) => acc + file.file_size, 0))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Files List */}
                  <div className="p-3">
                    <div className="table-responsive border border-bottom-0">
                      <table className="table text-nowrap table-hover">
                        <thead>
                          <tr>
                            <th scope="col">File Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Size</th>
                            <th scope="col">Date Modified</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="files-list">
                          {filteredFiles().map(file => (
                            <tr key={file._id}>
                              <th scope="row">
                                <div className="d-flex align-items-center">
                                  <div className="me-0">
                                    <span className="avatar avatar-md">
                                      {getFileIcon(file.file_type)}
                                    </span>
                                  </div>
                                  <div>
                                    <a href="javascript:void(0);" onClick={() => getFileDetails(file._id)}>
                                      {file.file_name}
                                    </a>
                                  </div>
                                </div>
                              </th>
                              <td>{file.file_type}</td>
                              <td>{formatFileSize(file.file_size)}</td>
                              <td>{new Date(file.uploaded_at).toLocaleDateString()}</td>
                              <td>
                                <div className="hstack gap-2 fs-15">
                                  <button 
                                    className="btn btn-icon btn-sm btn-primary2-light"
                                    onClick={() => handleDownload(file._id)}
                                  >
                                    <i className="ri-download-line" />
                                  </button>
                                  {activeTab !== 'shared' && (
                                    <button 
                                      className="btn btn-icon btn-sm btn-primary-light"
                                      onClick={() => openShareModal(file._id)}
                                    >
                                      <i className="ri-share-forward-line" />
                                    </button>
                                  )}
                                  <button className="btn btn-icon btn-sm btn-primary3-light">
                                    <i className="ri-delete-bin-line" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="col-xxl-3">
            <div className="card custom-card overflow-hidden">
              <div className="card-body">
                <div className="d-flex align-items-start gap-3">
                  <div>
                    <span className="avatar avatar-md bg-secondary-transparent">
                      <i className="ri-hard-drive-2-fill fs-16" />
                    </span>
                  </div>
                  <div className="flex-fill">
                    <div className="mb-3">
                      {" "}
                      Storage Usage
                      <p className="mb-0">
                        <span className="fw-bold fs-14">
                          {formatFileSize(files.reduce((acc, file) => acc + file.file_size, 0))}
                        </span> Used
                      </p>
                      <p className="fs-11 text-muted mb-0">
                        {/* You can calculate free space if you have a total storage limit */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer p-0">
                <div className="m-3 mb-0">
                  <span className="fs-12 text-muted">Storage Details</span>
                </div>
                <ul className="list-group list-group-flush">
                  {['image', 'video', 'audio', 'document', 'archive'].map(type => {
                    const typeFiles = files.filter(f => f.file_type === type);
                    const totalSize = typeFiles.reduce((acc, file) => acc + file.file_size, 0);
                    const percentage = files.length > 0 ? (typeFiles.length / files.length * 100).toFixed(0) : 0;
                    
                    return (
                      <li className="list-group-item" key={type}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar avatar-lg bg-primary-transparent border border-primary border-opacity-10">
                            <div className="avatar avatar-sm text-primary">
                              {getFileIcon(type)}
                            </div>
                          </div>
                          <div className="flex-fill">
                            <span className="fw-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            <span className="text-muted fs-12 d-block">
                              {typeFiles.length} files
                            </span>
                          </div>
                          <div>
                            <span className="fw-medium text-primary mb-0 fs-14">
                              {formatFileSize(totalSize)}
                            </span>
                          </div>
                        </div>
                        <div
                          className="progress progress-md p-1 bg-primary-transparent mt-3"
                          role="progressbar"
                          aria-valuenow={percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title">Share File</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowShareModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Share with users:</label>
                    <div className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {allUsers.map(user => (
                        <div key={user._id} className="list-group-item">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={usersToShare.includes(user._id)}
                              onChange={() => toggleUserSelection(user._id)}
                              id={`user-${user._id}`}
                            />
                            <label className="form-check-label" htmlFor={`user-${user._id}`}>
                              {user.firstName} {user.lastName} ({user.email})
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={makePublic}
                        onChange={(e) => setMakePublic(e.target.checked)}
                        id="makePublic"
                      />
                      <label className="form-check-label" htmlFor="makePublic">
                        Make file public
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Permission:</label>
                    <select 
                      className="form-select"
                      value={permission}
                      onChange={(e) => setPermission(e.target.value)}
                    >
                      <option value="view">View Only</option>
                      <option value="edit">Edit</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => setShowShareModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleShare}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Files Modal */}
        {showCategoryModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title">
                    {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Files
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCategoryModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table text-nowrap table-hover">
                      <thead>
                        <tr>
                          <th scope="col">File Name</th>
                          <th scope="col">Size</th>
                          <th scope="col">Date Modified</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterFilesByCategory(currentCategory).map(file => (
                          <tr key={file._id}>
                            <th scope="row">
                              <div className="d-flex align-items-center">
                                <div className="me-2">
                                  <span className="avatar avatar-sm">
                                    {getFileIcon(file.file_type)}
                                  </span>
                                </div>
                                <div>
                                  <a href="javascript:void(0);" onClick={() => getFileDetails(file._id)}>
                                    {file.file_name}
                                  </a>
                                </div>
                              </div>
                            </th>
                            <td>{formatFileSize(file.file_size)}</td>
                            <td>{new Date(file.uploaded_at).toLocaleDateString()}</td>
                            <td>
                              <div className="hstack gap-2 fs-15">
                                <button 
                                  className="btn btn-icon btn-sm btn-primary2-light"
                                  onClick={() => handleDownload(file._id)}
                                >
                                  <i className="ri-download-line" />
                                </button>
                                {activeTab !== 'shared' && (
                                  <button 
                                    className="btn btn-icon btn-sm btn-primary-light"
                                    onClick={() => openShareModal(file._id)}
                                  >
                                    <i className="ri-share-forward-line" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* File Details Offcanvas */}
        {showFileDetails && fileDetails && (
          <div className="offcanvas offcanvas-end show" tabIndex={-1} style={{ visibility: 'visible' }}>
            <div className="offcanvas-body p-0">
              <div className="selected-file-details">
                <div className="d-flex p-3 align-items-center justify-content-between border-bottom">
                  <div>
                    <h6 className="fw-medium mb-0">File Details</h6>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="dropdown me-1">
                      <button
                        className="btn btn-sm btn-icon btn-primary-light btn-wave waves-light waves-effect waves-light"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ri-more-2-fill" />
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button 
                            className="dropdown-item" 
                            onClick={() => {
                              setShowShareModal(true);
                              setShareFileId(fileDetails._id);
                              setShowFileDetails(false);
                            }}
                          >
                            Share
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={() => handleDownload(fileDetails._id)}>
                            Download
                          </button>
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-icon btn-outline-light border"
                      onClick={() => setShowFileDetails(false)}
                    >
                      <i className="ri-close-line" />
                    </button>
                  </div>
                </div>
                <div className="filemanager-file-details" id="filemanager-file-details">
                  <div className="p-3 text-center border-bottom border-block-end-dashed">
                    <div className="file-details mb-3">
                      <span className="avatar avatar-xxl">
                        {getFileIcon(fileDetails.file_type)}
                      </span>
                    </div>
                    <div>
                      <p className="mb-0 fw-medium fs-16">
                        {fileDetails.file_name}
                      </p>
                      <p className="mb-0 text-muted fs-10">
                        {formatFileSize(fileDetails.file_size)} | {new Date(fileDetails.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 border-bottom border-block-end-dashed">
                    <ul className="list-group">
                      <li className="list-group-item">
                        <div>
                          <span className="fw-medium">File Format : </span>
                          <span className="fs-12 text-muted">{fileDetails.file_extension}</span>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div>
                          <p className="fw-medium mb-0">File Type : </p>
                          <span className="fs-12 text-muted">
                            {fileDetails.file_type}
                          </span>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <p className="fw-medium mb-0">Owner : </p>
                        <span className="fs-12 text-muted">
                          {fileDetails.owner_id?.firstName} {fileDetails.owner_id?.lastName}
                        </span>
                      </li>
                    </ul>
                  </div>
                  {fileDetails.shared_with && fileDetails.shared_with.length > 0 && (
                    <div className="p-3">
                      <p className="mb-2 fw-medium fs-14">Shared With :</p>
                      {fileDetails.shared_with.map(share => (
                        <div key={share.user_id?._id} className="d-flex align-items-center p-2 mb-1">
                          <span className="avatar avatar-sm me-2 avatar-rounded">
            {share.user_id?.image ? (
              <img
                src={
                  share.user_id?.image.startsWith('http') || share.user_id?.image.startsWith('https')
                    ? share.user_id?.image // Use as-is if it's already a full URL
                    : `http://localhost:3000${share.user_id?.image}` // Prepend server URL if relative
                }
                alt="Profile"
                
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100";
                }}
              />
            ) : (
              <p>No profile image uploaded.</p>
            )}
          </span>
                          <span className="fw-medium flex-fill">
                            {share.user_id?.firstName} {share.user_id?.lastName}
                          </span>
                          <span className="badge bg-success-transparent fw-normal">
                            {share.permission}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default File;