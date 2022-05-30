import { createStore } from "vuex";
import axiosClient from "../axios";

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("TOKEN"),
    },
    dashboard: {
      loading: false,
      data: {}
    },
    patients: {
      loading: false,
      links: [],
      data: []
    },
    currentPatient: {
      data: {},
      loading: false,
    },
  },
  getters: {},
  actions: {

    register({commit}, user) {
      return axiosClient.post('/register', user)
        .then((response) => {
          commit('setUser', data.user);
          commit('setToken', data.token)
          return data;
        })
    },
    login({commit}, user) {
      return axiosClient.post('/login', user)
        .then(({data}) => {
          commit('setUser', data.user);
          commit('setToken', data.token)
          return data;
        })
    },
    logout({commit}) {
      return axiosClient.post('/logout')
        .then(response => {
          commit('logout')
          return response;
        })
    },
    getUser({commit}) {
      return axiosClient.get('/user')
      .then(res => {
        console.log(res);
        commit('setUser', res.data)
      })
    },
    getDashboardData({commit}) {
      commit('dashboardLoading', true)
      return axiosClient.get(`/dashboard`)
      .then((res) => {
        commit('dashboardLoading', false)
        commit('setDashboardData', res.data)
        return res;
      })
      .catch(error => {
        commit('dashboardLoading', false)
        return error;
      })

    },
    getPatients({ commit }, {url = null} = {}) {
      commit('setPatientsLoading', true)
      url = url || "/patient";
      return axiosClient.get(url).then((res) => {
        commit('setPatientsLoading', false)
        commit("setPatients", res.data);
        return res;
      });
    },
    getPatient({ commit }, id) {
      commit("setCurrentPatientLoading", true);
      return axiosClient
        .get(`/patient/${id}`)
        .then((res) => {
          commit("setCurrentPatient", res.data);
          commit("setCurrentPatientLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentPatientLoading", false);
          throw err;
        });
    },
    getPatientBySlug({ commit }, slug) {
      commit("setCurrentPatientLoading", true);
      return axiosClient
        .get(`/patient-by-slug/${slug}`)
        .then((res) => {
          commit("setCurrentPatient", res.data);
          commit("setCurrentPatientLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentPatientLoading", false);
          throw err;
        });
    },
    savePatient({ commit, dispatch }, patient) {
      let response;
      if (patient.id) {
        response = axiosClient
          .put(`/patient/${patient.id}`, patient)
          .then((res) => {
            commit('setCurrentPatient', res.data)
            return res;
          });
      } else {
        response = axiosClient.post("/patient", patient).then((res) => {
          commit('setCurrentPatient', res.data)
          return res;
        });
      }

      return response;
    },
    deletePatient({ dispatch }, id) {
      return axiosClient.delete(`/patient/${id}`).then((res) => {
        dispatch('getPatients')
        return res;
      });
    },
  },
  mutations: {
    logout: (state) => {
      state.user.token = null;
      state.user.data = {};
      sessionStorage.removeItem("TOKEN");
    },

    setUser: (state, user) => {
      state.user.data = user;
    },
    setToken: (state, token) => {
      state.user.token = token;
      sessionStorage.setItem('TOKEN', token);
    },
    dashboardLoading: (state, loading) => {
      state.dashboard.loading = loading;
    },
    setDashboardData: (state, data) => {
      state.dashboard.data = data
    },
    setPatientsLoading: (state, loading) => {
      state.patients.loading = loading;
    },
    setPatients: (state, patients) => {
      state.patients.links = patients.meta.links;
      state.patients.data = patients.data;
    },
    setCurrentPatientLoading: (state, loading) => {
      state.currentPatient.loading = loading;
    },
    setCurrentPatient: (state, patient) => {
      state.currentPatient.data = patient.data;
    },
    notify: (state, {message, type}) => {
      state.notification.show = true;
      state.notification.type = type;
      state.notification.message = message;
      setTimeout(() => {
        state.notification.show = false;
      }, 3000)
    },
  },
  modules: {},
});

export default store;
