// API Base URL
const API_BASE = 'http://localhost:5000/api';

// DOM Elements
const destinationsGrid = document.getElementById('destinationsGrid');
const packagesGrid = document.getElementById('packagesGrid');
const blogGrid = document.getElementById('blogGrid');
const galleryGrid = document.getElementById('galleryGrid');
const contactForm = document.getElementById('contactForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedDestinations();
    loadFeaturedPackages();
    loadFeaturedBlogPosts();
    initializeNavigation();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const sectionPosition = section.offsetTop - navHeight;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
}

// API Functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Load Featured Destinations
async function loadFeaturedDestinations() {
    try {
        const destinations = await apiCall('/destinations/featured');
        displayDestinations(destinations);
    } catch (error) {
        destinationsGrid.innerHTML = '<div class="loading">Failed to load destinations. Please try again later.</div>';
    }
}

function displayDestinations(destinations) {
    if (!destinations.length) {
        destinationsGrid.innerHTML = '<div class="loading">No destinations found.</div>';
        return;
    }
    
    destinationsGrid.innerHTML = destinations.map(destination => `
        <div class="destination-card">
            <img src="${destination.image}" alt="${destination.name}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${destination.name}</h3>
                <p class="card-text">${destination.description.substring(0, 100)}...</p>
                <div class="destination-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${destination.location}</span>
                    <span><i class="fas fa-tag"></i> ${destination.priceRange}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Featured Packages
async function loadFeaturedPackages() {
    try {
        const packages = await apiCall('/packages/featured');
        displayPackages(packages);
    } catch (error) {
        packagesGrid.innerHTML = '<div class="loading">Failed to load packages. Please try again later.</div>';
    }
}

function displayPackages(packages) {
    if (!packages.length) {
        packagesGrid.innerHTML = '<div class="loading">No packages found.</div>';
        return;
    }
    
    packagesGrid.innerHTML = packages.map(pkg => `
        <div class="package-card">
            <img src="${pkg.images && pkg.images.length > 0 ? pkg.images[0] : '/images/placeholder.jpg'}" alt="${pkg.title}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${pkg.title}</h3>
                <p class="card-text">${pkg.description.substring(0, 120)}...</p>
                <div class="package-details">
                    <span><i class="fas fa-clock"></i> ${pkg.duration.days} Days / ${pkg.duration.nights} Nights</span>
                    <span><i class="fas fa-map"></i> ${pkg.destinations ? pkg.destinations.length : 0} Destinations</span>
                </div>
                <div class="card-price">$${pkg.price}</div>
                <button class="btn-primary" onclick="showBookingModal('${pkg._id}')">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Load Featured Blog Posts
async function loadFeaturedBlogPosts() {
    try {
        const posts = await apiCall('/blog/featured');
        displayBlogPosts(posts);
    } catch (error) {
        blogGrid.innerHTML = '<div class="loading">Failed to load blog posts. Please try again later.</div>';
    }
}

function displayBlogPosts(posts) {
    if (!posts.length) {
        blogGrid.innerHTML = '<div class="loading">No blog posts found.</div>';
        return;
    }
    
    blogGrid.innerHTML = posts.map(post => `
        <div class="blog-card">
            <img src="${post.image || '/images/blog-placeholder.jpg'}" alt="${post.title}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${post.title}</h3>
                <p class="card-text">${post.excerpt || post.content.substring(0, 150)}...</p>
                <div class="blog-meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(post.publish_date).toLocaleDateString()}</span>
                </div>
                <button class="btn-secondary" onclick="viewBlogPost('${post._id}')">Read More</button>
            </div>
        </div>
    `).join('');
}

// Contact Form Handler
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        try {
            // Here you would typically send the contact form data to your backend
            // For now, we'll just show a success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            alert('Failed to send message. Please try again.');
        }
    });
}

// Modal Functions
function showBookingModal(packageId) {
    // In a real implementation, this would show a booking modal
    // For now, redirect to a booking page or show alert
    alert(`Booking package: ${packageId}\n\nIn a full implementation, this would open a booking form.`);
}

function viewBlogPost(postId) {
    // In a real implementation, this would navigate to the blog post page
    alert(`Viewing blog post: ${postId}\n\nIn a full implementation, this would open the full blog post.`);
}

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}