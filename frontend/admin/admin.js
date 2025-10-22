// Admin Panel JavaScript
const ADMIN_API_BASE = 'http://localhost:5000/api/admin';

// Simple admin authentication (in real app, use proper auth)
const ADMIN_TOKEN = 'admin-secret-key';

// Current admin state
let currentDestinations = [];

// Admin API call function
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
        showNotification('Error: ' + error.message, 'error');
        throw error;
    }
}

// Show/hide sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update menu active state
    document.querySelectorAll('.admin-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.admin-menu a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load section data
    loadSectionData(sectionId);
}

// Load data for specific section
async function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            await loadDashboardStats();
            break;
        case 'destinations':
            await loadDestinations();
            break;
        case 'packages':
            await loadPackages();
            break;
        case 'blog':
            await loadBlogPosts();
            break;
        case 'comments':
            await loadComments();
            break;
        case 'bookings':
            await loadBookings();
            break;
    }
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
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

// Load destinations
async function loadDestinations() {
    try {
        const destinations = await adminApiCall('/destinations');
        currentDestinations = destinations;
        displayDestinations(destinations);
    } catch (error) {
        document.getElementById('destinationsTable').innerHTML = 
            '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load destinations</td></tr>';
    }
}

// Display destinations in table
function displayDestinations(destinations) {
    const tableBody = document.getElementById('destinationsTable');
    
    if (!destinations || destinations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No destinations found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = destinations.map(dest => `
        <tr>
            <td>${dest.name}</td>
            <td>${dest.location}</td>
            <td>${dest.priceRange}</td>
            <td>${dest.featured ? 'Yes' : 'No'}</td>
            <td>
                <button class="btn-primary btn-sm" onclick="editDestination('${dest._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-secondary btn-sm" onclick="deleteDestination('${dest._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Add new destination
document.getElementById('destinationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('destName').value,
        location: document.getElementById('destLocation').value,
        description: document.getElementById('destDescription').value,
        image: document.getElementById('destImage').value,
        priceRange: document.getElementById('destPriceRange').value,
        bestTimeToVisit: document.getElementById('destBestTime').value,
        featured: document.getElementById('destFeatured').checked
    };
    
    try {
        await adminApiCall('/destinations', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        showNotification('Destination added successfully!', 'success');
        document.getElementById('destinationForm').reset();
        await loadDestinations(); // Refresh the list
    } catch (error) {
        showNotification('Failed to add destination', 'error');
    }
});

// Edit destination
function editDestination(destinationId) {
    const destination = currentDestinations.find(d => d._id === destinationId);
    if (destination) {
        // Populate form with destination data
        document.getElementById('destName').value = destination.name;
        document.getElementById('destLocation').value = destination.location;
        document.getElementById('destDescription').value = destination.description;
        document.getElementById('destImage').value = destination.image;
        document.getElementById('destPriceRange').value = destination.priceRange;
        document.getElementById('destBestTime').value = destination.bestTimeToVisit || '';
        document.getElementById('destFeatured').checked = destination.featured;
        
        // Change form to update mode
        const form = document.getElementById('destinationForm');
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Update Destination';
        submitButton.onclick = async (e) => {
            e.preventDefault();
            await updateDestination(destinationId);
        };
        
        showNotification(`Editing: ${destination.name}`, 'info');
    }
}

// Update destination
async function updateDestination(destinationId) {
    const formData = {
        name: document.getElementById('destName').value,
        location: document.getElementById('destLocation').value,
        description: document.getElementById('destDescription').value,
        image: document.getElementById('destImage').value,
        priceRange: document.getElementById('destPriceRange').value,
        bestTimeToVisit: document.getElementById('destBestTime').value,
        featured: document.getElementById('destFeatured').checked
    };
    
    try {
        await adminApiCall(`/destinations/${destinationId}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });
        
        showNotification('Destination updated successfully!', 'success');
        resetDestinationForm();
        await loadDestinations();
    } catch (error) {
        showNotification('Failed to update destination', 'error');
    }
}

// Delete destination
async function deleteDestination(destinationId) {
    if (confirm('Are you sure you want to delete this destination?')) {
        try {
            await adminApiCall(`/destinations/${destinationId}`, {
                method: 'DELETE'
            });
            
            showNotification('Destination deleted successfully!', 'success');
            await loadDestinations();
        } catch (error) {
            showNotification('Failed to delete destination', 'error');
        }
    }
}

// Reset destination form
function resetDestinationForm() {
    document.getElementById('destinationForm').reset();
    const submitButton = document.querySelector('#destinationForm button[type="submit"]');
    submitButton.textContent = 'Add Destination';
    submitButton.onclick = null;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.admin-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Load other sections (simplified for now)
async function loadPackages() {
    console.log('Loading packages...');
}

async function loadBlogPosts() {
    console.log('Loading blog posts...');
}

async function loadComments() {
    console.log('Loading comments...');
}

async function loadBookings() {
    console.log('Loading bookings...');
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel loaded');
    // Load dashboard by default
    loadDashboardStats();
});