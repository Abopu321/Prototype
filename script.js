// Import Firebase modules
import { ref, push, onValue, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';
import { database, storage } from './firebase-config.js';

// Global variables
let userName, profileImage;

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get user data from localStorage
    userName = localStorage.getItem('userName');
    profileImage = localStorage.getItem('profileImage');

    // Redirect to home if no user data
    if (!userName) {
        window.location.href = 'index.html';
        return;
    }

    // Display current user info
    if (document.getElementById('currentUserName')) {
        document.getElementById('currentUserName').textContent = userName;
        document.getElementById('currentUserImage').src = profileImage;
    }

    // Initialize chat functionality
    initializeChat();
});

// Initialize chat functionality
function initializeChat() {
    // Send welcome message when user joins
    sendWelcomeMessage();

    // Get DOM elements
    const messagesRef = ref(database, 'messages');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const imageInput = document.getElementById('imageInput');
    const uploadLoading = document.getElementById('uploadLoading');

    // Listen for new messages
    onValue(messagesRef, (snapshot) => {
        chatMessages.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const messageData = childSnapshot.val();
            displayMessage(messageData, chatMessages);
        });
    });

    // Event listeners
    if (sendBtn) {
        sendBtn.addEventListener('click', () => sendMessage(messageInput, messagesRef));
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage(messageInput, messagesRef);
            }
        });
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            imageInput.click();
        });
    }

    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    alert('Image must be smaller than 5MB');
                    return;
                }
                uploadImage(file, messagesRef, uploadLoading);
            }
        });
    }
}

// Send welcome message when user joins
function sendWelcomeMessage() {
    const messagesRef = ref(database, 'messages');
    push(messagesRef, {
        name: 'System',
        profileImage: '🔔',
        message: `Welcome ${userName} to QuickChat!`,
        timestamp: serverTimestamp(),
        isSystem: true
    });
}

// Send message function
function sendMessage(messageInput, messagesRef) {
    const messageText = messageInput.value.trim();
    if (!messageText) return;

    push(messagesRef, {
        name: userName,
        profileImage: profileImage,
        message: messageText,
        timestamp: serverTimestamp()
    });

    messageInput.value = '';
}

// Upload image function
async function uploadImage(file, messagesRef, uploadLoading) {
    uploadLoading.style.display = 'flex';
    
    try {
        const imageRef = storageRef(storage, 'images/' + Date.now() + '_' + file.name);
        const snapshot = await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // Send image as message
        push(messagesRef, {
            name: userName,
            profileImage: profileImage,
            imageURL: downloadURL,
            timestamp: serverTimestamp()
        });
        
        uploadLoading.style.display = 'none';
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
        uploadLoading.style.display = 'none';
    }
}

// Format timestamp
function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Display messages
function displayMessage(messageData, chatMessages) {
    const messageDiv = document.createElement('div');
    messageDiv.className = messageData.isSystem ? 'message system-message' : 'message';
    
    if (messageData.isSystem) {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="system-text">${messageData.message}</div>
                <div class="message-time">${formatTime(messageData.timestamp)}</div>
            </div>
        `;
    } else {
        const hasImage = messageData.imageURL;
        const hasText = messageData.message;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${messageData.profileImage}" alt="${messageData.name}" onerror="this.src='https://via.placeholder.com/40/666666/ffffff?text=U'">
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-name">${escapeHtml(messageData.name)}</span>
                    <span class="message-time">${formatTime(messageData.timestamp)}</span>
                </div>
                ${hasText ? `<div class="message-text">${escapeHtml(messageData.message)}</div>` : ''}
                ${hasImage ? `<div class="message-image"><img src="${messageData.imageURL}" alt="Shared image" onclick="openImageModal('${messageData.imageURL}')"></div>` : ''}
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Open image in modal (simple implementation)
function openImageModal(imageUrl) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Make openImageModal globally available
window.openImageModal = openImageModal;

// Join form functionality for index.html
if (document.getElementById('joinForm')) {
    document.getElementById('joinForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userNameInput = document.getElementById('userName').value.trim();
        const profileImageInput = document.getElementById('profileImage').value.trim();
        
        if (!userNameInput) {
            alert('Please enter your name');
            return;
        }
        
        // Validate name length
        if (userNameInput.length > 50) {
            alert('Name must be less than 50 characters');
            return;
        }
        
        // Save user data to localStorage
        localStorage.setItem('userName', userNameInput);
        localStorage.setItem('profileImage', profileImageInput || 'https://via.placeholder.com/40/667eea/ffffff?text=' + userNameInput.charAt(0).toUpperCase());
        
        // Redirect to chat page
        window.location.href = 'chat.html';
    });
}