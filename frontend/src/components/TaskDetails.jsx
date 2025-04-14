import React, { useState, useEffect } from 'react';
import './TaskDetails.css';

const TaskDetails = ({ task, onTimeChange, onToggleComplete, onDelete, onContentChange }) => {
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [startTime, setStartTime] = useState(task.startTime.split('T')[1].substring(0, 5));
  const [endTime, setEndTime] = useState(task.endTime.split('T')[1].substring(0, 5));
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.title);
  const [error, setError] = useState(null);

  // Cập nhật editedContent khi task thay đổi
  useEffect(() => {
    setEditedContent(task.title);
  }, [task.title]);

  const handleTimeChange = () => {
    // Validate end time is after start time
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) {
      setError('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    setError(null);
    onTimeChange(task._id, startTime, endTime);
  };

  const handleContentSubmit = () => {
    if (editedContent.trim() !== task.title) {
      onContentChange(task._id, editedContent.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleContentSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedContent(task.title);
    }
  };

  return (
    <div className="task-details">
      {/* Time Button */}
      <button 
        className="time-button"
        onClick={() => setIsTimeModalOpen(true)}
      >
        {task.timeRange}
      </button>

      {/* Task Content - Now Editable */}
      <div className="task-content-container">
        {isEditing ? (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onBlur={handleContentSubmit}
            onKeyDown={handleKeyPress}
            className="task-content-input"
            autoFocus
          />
        ) : (
          <div 
            className={`task-content ${task.completed ? 'completed' : ''}`}
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </div>
        )}
      </div>

      {/* Complete Button */}
      <button 
        className={`complete-button ${task.completed ? 'completed' : ''}`}
        onClick={() => onToggleComplete(task._id)}
      >
        {task.completed ? 'Completed' : 'Complete'}
      </button>

      {/* Delete Button */}
      <button 
        className="delete-button"
        onClick={() => setShowConfirmDelete(true)}
      >
        Delete
      </button>

      {/* Time Change Modal */}
      {isTimeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3>Change Time</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleTimeChange();
            }}>
              <div className="time-inputs">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
                <span>-</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => setIsTimeModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-actions">
              <button onClick={() => setShowConfirmDelete(false)}>Cancel</button>
              <button 
                className="delete-confirm"
                onClick={() => {
                  onDelete(task._id);
                  setShowConfirmDelete(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
