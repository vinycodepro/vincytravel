// Admin JavaScript
const ADMIN_API_BASE = 'http://localhost:5000/api/admin';

// Admin authentication (basic implementation)
const ADMIN_TOKEN = 'admin-secret-key';

async function adminApiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${ADMIN_API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ADMIN_TOKEN,
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Admin API call failed:', error);
        throw error;
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // In a full implementation, you would have specific endpoints for these stats
        const [bookings, comments, packages, blogPosts] = await Promise.all([
            adminApiCall('/bookings'),
            adminApiCall('/comments'),
            adminApiCall('/packages'),
            adminApiCall('/blog')
        ]);
        
        document.getElementById('totalBookings').textContent = bookings.length;
        document.getElementById('pendingComments').textContent = comments.filter(c => !c.approved).length;
        document.getElementById('activePackages').textContent = packages.length;
        document.getElementById('totalPosts').textContent = blogPosts.length;
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    
    // Add admin menu functionality
    document.querySelectorAll('.admin-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.admin-menu a').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding section
            const targetId = link.getAttribute('href').substring(1);
            showAdminSection(targetId);
        });
    });
});

function showAdminSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}