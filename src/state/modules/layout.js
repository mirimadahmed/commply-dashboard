export const state = {
  layoutType: 'vertical'
}

export const getters = {}

export const mutations = {
  CHANGE_LAYOUT(state, layoutType) {
    state.layoutType = layoutType;
  }
}

export const actions = {
  changeLayoutType({ commit, state, rootState }, { layoutType }) {
    commit('CHANGE_LAYOUT', layoutType);
  },
}
