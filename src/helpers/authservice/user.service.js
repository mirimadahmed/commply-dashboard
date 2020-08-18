import { authHeader } from './auth-header';

export const userService = {
    login,
    logout
};

function login(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}
