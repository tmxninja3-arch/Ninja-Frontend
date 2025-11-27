import { useState, useRef } from 'react';
import { Button, ProgressBar, Alert, Image, Spinner } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './CloudinaryUpload.css';

const CloudinaryUpload = ({
  onUploadSuccess,
  currentImage,
  uploadType = 'game',
  buttonText = 'Upload Image',
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      toast.error('Invalid file type!');
      return;
    }

    // Validate file size (10MB for Cloudinary)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      toast.error('File too large!');
      return;
    }

    setError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle upload to Cloudinary
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create FormData
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Determine endpoint
      const endpoint =
        uploadType === 'game' ? '/upload/game-image' : '/upload/profile-image';

      // Upload to backend (which uploads to Cloudinary)
      const { data } = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success('Image uploaded to Cloudinary successfully! ☁️');

      // Call callback with Cloudinary URL
      if (onUploadSuccess) {
        onUploadSuccess(data.data.url, data.data.publicId);
      }

      // Reset states
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed';
      setError(message);
      toast.error(message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setSelectedFile(null);
    setPreview(currentImage || null);
    setError('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open file picker
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="cloudinary-upload-container">
      {/* Preview Section */}
      {preview && (
        <div className="image-preview-section mb-3">
          <div className="position-relative d-inline-block">
            <Image src={preview} alt="Preview" thumbnail className="preview-image" />
            {currentImage && (
              <div className="cloudinary-badge">
                <small>☁️ Cloudinary</small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="d-none"
        disabled={uploading}
      />

      {/* Upload Area */}
      <div
        className={`upload-dropzone ${selectedFile ? 'file-selected' : ''}`}
        onClick={handleButtonClick}
      >
        {selectedFile ? (
          <div className="file-info">
            <div className="file-icon">📷</div>
            <div className="file-name">{selectedFile.name}</div>
            <div className="file-size">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </div>
          </div>
        ) : (
          <div className="dropzone-content">
            <div className="upload-icon">☁️</div>
            <p className="mb-1">
              <strong>Click to select image</strong>
            </p>
            <small className="text-muted">
              Supports: JPEG, PNG, GIF, WEBP (Max 10MB)
            </small>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mt-3">
          {error}
        </Alert>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="mt-3">
          <div className="d-flex justify-content-between mb-1">
            <small>Uploading to Cloudinary...</small>
            <small>{uploadProgress}%</small>
          </div>
          <ProgressBar
            now={uploadProgress}
            variant="success"
            animated
            striped
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="d-flex gap-2 mt-3">
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="flex-grow-1"
        >
          {uploading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Uploading...
            </>
          ) : (
            <>☁️ {buttonText}</>
          )}
        </Button>

        {selectedFile && (
          <Button variant="outline-secondary" onClick={handleReset} disabled={uploading}>
            Reset
          </Button>
        )}
      </div>

      {/* Info */}
      <div className="upload-info mt-3">
        <small className="text-muted">
          ℹ️ Images are stored on Cloudinary cloud storage with automatic optimization
        </small>
      </div>
    </div>
  );
};

export default CloudinaryUpload;