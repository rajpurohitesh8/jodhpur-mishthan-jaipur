// User Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.isLoggedIn = !!this.currentUser;
    }

    register(name, email, phone, password) {
        // Validate input
        if (!name || !email || !phone || !password) {
            throw new Error('All fields are required');
        }

        // Check if user exists
        if (this.users.find(u => u.email === email)) {
            throw new Error('User already exists with this email');
        }

        // Create new user
        const newUser = { id: Date.now(), name, email, phone, password };
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Auto login
        this.currentUser = { id: newUser.id, name, email };
        this.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return this.currentUser;
    }

    login(email, password) {
        // Validate input
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Find user
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Set current user
        this.currentUser = { id: user.id, name: user.name, email: user.email };
        this.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// Initialize auth system
const auth = new AuthSystem();