const Chat = require('../models/chat');
const User = require('../models/user');
const ChatGroup = require('../models/chatGroup');
const GroupMessage = require('../models/groupMessage');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Helper function to get user details
const getUserDetails = async (userId) => {
    try {
        const user = await User.findById(userId).select('firstName lastName email image role');

        if (user) {
            // Convert to plain object to allow adding properties
            const userObj = user.toObject();

            // Add name property for compatibility
            userObj.name = `${userObj.firstName} ${userObj.lastName}`;

            // Map image to profileImage for compatibility
            userObj.profileImage = userObj.image;

            return userObj;
        }

        return null;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

// Get all chats for a user
exports.getUserChats = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all chats where the user is either sender or receiver
        const chats = await Chat.find({
            $or: [
                { sender_id: userId },
                { receiver_id: userId }
            ]
        }).sort({ sent_at: -1 });

        // Group chats by the other user (conversation partner)
        const conversations = {};

        for (const chat of chats) {
            const otherUserId = chat.sender_id.toString() === userId ?
                chat.receiver_id.toString() : chat.sender_id.toString();

            if (!conversations[otherUserId]) {
                const otherUser = await getUserDetails(otherUserId);
                conversations[otherUserId] = {
                    user: otherUser,
                    lastMessage: chat,
                    unreadCount: chat.sender_id.toString() !== userId && !chat.is_read ? 1 : 0
                };
            } else if (chat.sender_id.toString() !== userId && !chat.is_read) {
                conversations[otherUserId].unreadCount += 1;
            }
        }

        res.status(200).json({
            success: true,
            data: Object.values(conversations)
        });
    } catch (error) {
        console.error('Error fetching user chats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user chats',
            error: error.message
        });
    }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;

        // Find all messages between the two users
        const messages = await Chat.find({
            $or: [
                { sender_id: userId, receiver_id: otherUserId },
                { sender_id: otherUserId, receiver_id: userId }
            ]
        }).sort({ sent_at: 1 });

        // Mark all messages as read
        await Chat.updateMany(
            { sender_id: otherUserId, receiver_id: userId, is_read: false },
            { $set: { is_read: true } }
        );

        // Get user details
        const otherUser = await getUserDetails(otherUserId);

        res.status(200).json({
            success: true,
            data: {
                messages,
                user: otherUser
            }
        });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching conversation',
            error: error.message
        });
    }
};

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id, message } = req.body;

        // Create new message
        const newMessage = new Chat({
            sender_id,
            receiver_id,
            message,
            sent_at: new Date(),
            is_read: false
        });

        // Handle file attachment if present
        if (req.file) {
            const fileType = req.file.mimetype.split('/')[0];
            newMessage.attachment = req.file.filename;
            newMessage.attachment_type = fileType === 'image' ? 'image' :
                                        fileType === 'video' ? 'video' : 'file';
        }

        await newMessage.save();

        // Get the io instance
        const io = req.app.get('io');

        // Emit the message to the receiver
        io.to(receiver_id).emit('new_message', {
            message: newMessage,
            sender: await getUserDetails(sender_id)
        });

        res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
};

// Get all chat groups for a user
exports.getUserGroups = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all groups where the user is a member
        const groups = await ChatGroup.find({
            members: userId
        }).populate('creator', 'name email profileImage')
          .populate('members', 'name email profileImage');

        // Get last message for each group
        const groupsWithLastMessage = await Promise.all(groups.map(async (group) => {
            const lastMessage = await GroupMessage.findOne({ group_id: group._id })
                .sort({ sent_at: -1 })
                .populate('sender_id', 'name email profileImage');

            // Count unread messages
            const unreadCount = await GroupMessage.countDocuments({
                group_id: group._id,
                read_by: { $ne: userId }
            });

            return {
                ...group.toObject(),
                lastMessage,
                unreadCount
            };
        }));

        res.status(200).json({
            success: true,
            data: groupsWithLastMessage
        });
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user groups',
            error: error.message
        });
    }
};

// Create a new chat group
exports.createGroup = async (req, res) => {
    try {
        const { name, description, creator, members } = req.body;

        // Create new group
        const newGroup = new ChatGroup({
            name,
            description,
            creator,
            members: [...new Set([creator, ...members])], // Ensure unique members including creator
            last_message: new Date()
        });

        // Handle group avatar if present
        if (req.file) {
            newGroup.avatar = req.file.filename;
        }

        await newGroup.save();

        // Get the io instance
        const io = req.app.get('io');

        // Notify all members about the new group
        members.forEach(memberId => {
            io.to(memberId).emit('new_group', newGroup);
        });

        res.status(201).json({
            success: true,
            data: newGroup
        });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating group',
            error: error.message
        });
    }
};

// Get messages for a group
exports.getGroupMessages = async (req, res) => {
    try {
        const { groupId, userId } = req.params;

        // Find all messages for the group
        const messages = await GroupMessage.find({ group_id: groupId })
            .sort({ sent_at: 1 })
            .populate('sender_id', 'name email profileImage');

        // Mark messages as read by this user
        await GroupMessage.updateMany(
            { group_id: groupId, read_by: { $ne: userId } },
            { $addToSet: { read_by: userId } }
        );

        // Get group details
        const group = await ChatGroup.findById(groupId)
            .populate('creator', 'name email profileImage')
            .populate('members', 'name email profileImage');

        res.status(200).json({
            success: true,
            data: {
                messages,
                group
            }
        });
    } catch (error) {
        console.error('Error fetching group messages:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching group messages',
            error: error.message
        });
    }
};

// Send a message to a group
exports.sendGroupMessage = async (req, res) => {
    try {
        const { group_id, sender_id, message } = req.body;

        // Create new message
        const newMessage = new GroupMessage({
            group_id,
            sender_id,
            message,
            sent_at: new Date(),
            read_by: [sender_id] // Sender has read the message
        });

        // Handle file attachment if present
        if (req.file) {
            const fileType = req.file.mimetype.split('/')[0];
            newMessage.attachment = req.file.filename;
            newMessage.attachment_type = fileType === 'image' ? 'image' :
                                        fileType === 'video' ? 'video' : 'file';
        }

        await newMessage.save();

        // Update group's last message timestamp
        await ChatGroup.findByIdAndUpdate(group_id, {
            last_message: new Date()
        });

        // Get the io instance
        const io = req.app.get('io');

        // Get group members
        const group = await ChatGroup.findById(group_id);

        // Get sender details once
        const senderInfo = await getUserDetails(sender_id);

        // Emit the message to all group members
        for (const memberId of group.members) {
            if (memberId.toString() !== sender_id) {
                io.to(memberId.toString()).emit('new_group_message', {
                    message: newMessage,
                    sender: senderInfo,
                    group: group
                });
            }
        }

        res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (error) {
        console.error('Error sending group message:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending group message',
            error: error.message
        });
    }
};

// Get all contacts (users)
exports.getContacts = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Fetching contacts for user ID: ${userId}`);

        // Get all users except the current user
        const users = await User.find({ _id: { $ne: userId } })
            .select('firstName lastName email image role')
            .sort({ firstName: 1, lastName: 1 });

        console.log(`Found ${users.length} users`);

        // Group users by first letter of firstName
        const contacts = {};

        users.forEach(user => {
            // Create a name property for compatibility with the frontend
            user = user.toObject();
            user.name = `${user.firstName} ${user.lastName}`;
            user.profileImage = user.image; // Map image to profileImage for frontend compatibility

            const firstLetter = user.firstName.charAt(0).toUpperCase();
            if (!contacts[firstLetter]) {
                contacts[firstLetter] = [];
            }
            contacts[firstLetter].push(user);
        });

        console.log(`Grouped users into ${Object.keys(contacts).length} letter categories`);

        res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: error.message
        });
    }
};

// Add user to group
exports.addUserToGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.params;

        // Add user to group
        const updatedGroup = await ChatGroup.findByIdAndUpdate(
            groupId,
            { $addToSet: { members: userId } },
            { new: true }
        ).populate('creator', 'name email profileImage')
         .populate('members', 'name email profileImage');

        // Get the io instance
        const io = req.app.get('io');

        // Notify the user about being added to the group
        io.to(userId).emit('added_to_group', updatedGroup);

        res.status(200).json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        console.error('Error adding user to group:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding user to group',
            error: error.message
        });
    }
};

// Remove user from group
exports.removeUserFromGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.params;

        // Remove user from group
        const updatedGroup = await ChatGroup.findByIdAndUpdate(
            groupId,
            { $pull: { members: userId } },
            { new: true }
        ).populate('creator', 'name email profileImage')
         .populate('members', 'name email profileImage');

        // Get the io instance
        const io = req.app.get('io');

        // Notify the user about being removed from the group
        io.to(userId).emit('removed_from_group', updatedGroup);

        res.status(200).json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        console.error('Error removing user from group:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing user from group',
            error: error.message
        });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        // Find and delete the message
        const message = await Chat.findByIdAndDelete(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Delete attachment if exists
        if (message.attachment) {
            const filePath = path.join(__dirname, '../public/uploads/chat', message.attachment);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Get the io instance
        const io = req.app.get('io');

        // Notify the receiver about the deleted message
        io.to(message.receiver_id.toString()).emit('message_deleted', messageId);

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting message',
            error: error.message
        });
    }
};

// Delete a group message
exports.deleteGroupMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        // Find and delete the message
        const message = await GroupMessage.findByIdAndDelete(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Delete attachment if exists
        if (message.attachment) {
            const filePath = path.join(__dirname, '../public/uploads/chat', message.attachment);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Get the io instance
        const io = req.app.get('io');

        // Get group members
        const group = await ChatGroup.findById(message.group_id);

        // Notify all group members about the deleted message
        group.members.forEach(memberId => {
            if (memberId.toString() !== message.sender_id.toString()) {
                io.to(memberId.toString()).emit('group_message_deleted', {
                    messageId,
                    groupId: message.group_id
                });
            }
        });

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting group message:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting group message',
            error: error.message
        });
    }
};
