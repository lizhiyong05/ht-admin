import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './store/actions'
import * as mutations from './store/mutations'
import * as getters from './store/getters'
Vue.use(Vuex);
const state = {
    tags: [],
    uploadProgress:{
        '123': 45,

    }
};
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
