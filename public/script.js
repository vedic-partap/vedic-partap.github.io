class BookmarkManager {
    constructor() {
        this.bookmarks = [];
        this.currentEditId = null;
        this.allTags = new Set();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Add bookmark form
        document.getElementById('addBookmarkForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddBookmark();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Tag filter
        document.getElementById('tagFilter').addEventListener('change', (e) => {
            this.handleTagFilter(e.target.value);
        });

        // Edit modal
        document.getElementById('editBookmarkForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditBookmark();
        });

        // Modal close buttons
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('editModal')) {
                this.closeModal();
            }
        });
    }

    async handleLogin() {
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');
        
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('app').style.display = 'block';
                this.loadBookmarks();
            } else {
                errorDiv.textContent = data.error || 'Login failed';
            }
        } catch (error) {
            errorDiv.textContent = 'Network error. Please try again.';
        }
    }

    async handleLogout() {
        try {
            await fetch('/logout', { method: 'POST' });
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('app').style.display = 'none';
            document.getElementById('password').value = '';
            document.getElementById('login-error').textContent = '';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async handleAddBookmark() {
        const url = document.getElementById('bookmarkUrl').value;
        const title = document.getElementById('bookmarkTitle').value;
        const tags = document.getElementById('bookmarkTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        if (!url || !title) {
            alert('Please provide both URL and title');
            return;
        }

        try {
            const response = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, title, tags })
            });

            if (response.ok) {
                document.getElementById('addBookmarkForm').reset();
                this.loadBookmarks();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to add bookmark');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        }
    }

    async handleEditBookmark() {
        const id = document.getElementById('editBookmarkId').value;
        const url = document.getElementById('editBookmarkUrl').value;
        const title = document.getElementById('editBookmarkTitle').value;
        const tags = document.getElementById('editBookmarkTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        try {
            const response = await fetch(`/api/bookmarks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, title, tags })
            });

            if (response.ok) {
                this.closeModal();
                this.loadBookmarks();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to update bookmark');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        }
    }

    async handleDeleteBookmark(id) {
        if (!confirm('Are you sure you want to delete this bookmark?')) {
            return;
        }

        try {
            const response = await fetch(`/api/bookmarks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.loadBookmarks();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete bookmark');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        }
    }

    async loadBookmarks() {
        try {
            const response = await fetch('/api/bookmarks');
            
            if (response.ok) {
                this.bookmarks = await response.json();
                this.updateTagFilter();
                this.renderBookmarks();
            } else {
                console.error('Failed to load bookmarks');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    updateTagFilter() {
        this.allTags.clear();
        this.bookmarks.forEach(bookmark => {
            bookmark.tags.forEach(tag => {
                this.allTags.add(tag);
            });
        });

        const tagFilter = document.getElementById('tagFilter');
        tagFilter.innerHTML = '<option value="">All Tags</option>';
        
        Array.from(this.allTags).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });
    }

    renderBookmarks() {
        const bookmarksList = document.getElementById('bookmarksList');
        const bookmarkCount = document.getElementById('bookmarkCount');
        
        bookmarkCount.textContent = this.bookmarks.length;

        if (this.bookmarks.length === 0) {
            bookmarksList.innerHTML = `
                <div class="empty-state">
                    <h3>No bookmarks yet</h3>
                    <p>Add your first bookmark above to get started!</p>
                </div>
            `;
            return;
        }

        bookmarksList.innerHTML = this.bookmarks.map(bookmark => {
            const dateAdded = new Date(bookmark.dateAdded).toLocaleDateString();
            const tagsHtml = bookmark.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');

            return `
                <div class="bookmark-item">
                    <div class="bookmark-title">
                        <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer">
                            ${bookmark.title}
                        </a>
                    </div>
                    <div class="bookmark-url">${bookmark.url}</div>
                    <div class="bookmark-tags">${tagsHtml}</div>
                    <div class="bookmark-date">Added: ${dateAdded}</div>
                    <div class="bookmark-actions">
                        <button class="edit-btn" onclick="bookmarkManager.openEditModal('${bookmark.id}')">
                            Edit
                        </button>
                        <button class="delete-btn" onclick="bookmarkManager.handleDeleteBookmark('${bookmark.id}')">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    handleSearch(query) {
        const filteredBookmarks = this.bookmarks.filter(bookmark => {
            const searchText = query.toLowerCase();
            return bookmark.title.toLowerCase().includes(searchText) ||
                   bookmark.url.toLowerCase().includes(searchText) ||
                   bookmark.tags.some(tag => tag.toLowerCase().includes(searchText));
        });

        this.renderFilteredBookmarks(filteredBookmarks);
    }

    handleTagFilter(selectedTag) {
        if (!selectedTag) {
            this.renderBookmarks();
            return;
        }

        const filteredBookmarks = this.bookmarks.filter(bookmark => 
            bookmark.tags.includes(selectedTag)
        );

        this.renderFilteredBookmarks(filteredBookmarks);
    }

    renderFilteredBookmarks(filteredBookmarks) {
        const bookmarksList = document.getElementById('bookmarksList');
        const bookmarkCount = document.getElementById('bookmarkCount');
        
        bookmarkCount.textContent = `${filteredBookmarks.length} / ${this.bookmarks.length}`;

        if (filteredBookmarks.length === 0) {
            bookmarksList.innerHTML = `
                <div class="empty-state">
                    <h3>No bookmarks found</h3>
                    <p>Try adjusting your search or filter.</p>
                </div>
            `;
            return;
        }

        bookmarksList.innerHTML = filteredBookmarks.map(bookmark => {
            const dateAdded = new Date(bookmark.dateAdded).toLocaleDateString();
            const tagsHtml = bookmark.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');

            return `
                <div class="bookmark-item">
                    <div class="bookmark-title">
                        <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer">
                            ${bookmark.title}
                        </a>
                    </div>
                    <div class="bookmark-url">${bookmark.url}</div>
                    <div class="bookmark-tags">${tagsHtml}</div>
                    <div class="bookmark-date">Added: ${dateAdded}</div>
                    <div class="bookmark-actions">
                        <button class="edit-btn" onclick="bookmarkManager.openEditModal('${bookmark.id}')">
                            Edit
                        </button>
                        <button class="delete-btn" onclick="bookmarkManager.handleDeleteBookmark('${bookmark.id}')">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    openEditModal(id) {
        const bookmark = this.bookmarks.find(b => b.id === id);
        if (!bookmark) return;

        document.getElementById('editBookmarkId').value = bookmark.id;
        document.getElementById('editBookmarkUrl').value = bookmark.url;
        document.getElementById('editBookmarkTitle').value = bookmark.title;
        document.getElementById('editBookmarkTags').value = bookmark.tags.join(', ');

        document.getElementById('editModal').style.display = 'block';
        this.currentEditId = id;
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.currentEditId = null;
    }

    // Auto-fetch title from URL (optional enhancement)
    async fetchTitleFromUrl(url) {
        try {
            // This would require a backend endpoint to fetch the title
            // For now, we'll just return null
            return null;
        } catch (error) {
            console.error('Error fetching title:', error);
            return null;
        }
    }
}

// Initialize the bookmark manager when the page loads
let bookmarkManager;
document.addEventListener('DOMContentLoaded', () => {
    bookmarkManager = new BookmarkManager();
});

// Helper function to escape HTML
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
} 