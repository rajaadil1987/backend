const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const {
  getNotifications: alertsHandler,
  getUnreadCount: countHandler,
  markAsRead: readHandler,
  markAllAsRead: readAllHandler,
  deleteNotification: deleteHandler
} = require('../controllers/notification.controller');

const router = express.Router();

// Get user notifications
router.get('/', authenticate, alertsHandler);

// Get unread notifications count
router.get('/unread-count', authenticate, countHandler);

// Mark notification as read
router.patch('/:id/mark-read', authenticate, readHandler);

// Mark all notifications as read
router.patch('/mark-all-read', authenticate, readAllHandler);

// Delete notification
router.delete('/:id', authenticate, deleteHandler);

module.exports = router;
