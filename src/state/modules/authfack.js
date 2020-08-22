import { userService } from '../../helpers/authservice/user.service';
import router from '../../router/index'

const user = JSON.parse(localStorage.getItem('user'));
export const state = user
    ? { status: { loggeduser: true }, user }
    : { status: {}, user: null };

export const actions = {
    // Logs in the user.
    // eslint-disable-next-line no-unused-vars
    login({ dispatch, commit }, user) {
        userService.login(user);
        commit('loginSuccess', user);
        router.push('/companies');
    },
    // Logout the user
    logout({ commit }) {
        userService.logout();
        commit('logout');
    },
};

export const mutations = {
    loginSuccess(state, user) {
        state.status = { loggeduser: true };
        state.user = user;
    },
    logout(state) {
        state.status = {};
        state.user = null;
    },
};

export const getters = {
    // Whether the user is currently logged in.
    loggedIn(state) {
        return state.status.loggeduser
    },
}

