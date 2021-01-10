import { createStore } from "vuex";

import PouchDB from "pouchdb-browser";

const dbRecipes = new PouchDB("recipes");

const store = createStore({
  state: {
    recipes: [],
    isLoading: false,
    recipe: {}
  },
  mutations: {
    setRecipes(state, recipes) {
      state.recipes = recipes;
    },
    setLoading(state, loading) {
      state.isLoading = loading;
    },
    setRecipe(state, recipe) {
      state.recipe = recipe;
    }
  },
  actions: {
    async saveRecipe(context, recipe) {
      const result = await dbRecipes.put(recipe);
      // TODO update recipes?
      return result;
    },
    async createRecipe(context, recipe) {
      const result = await dbRecipes.post(recipe);
      // TODO update recipes?
      return result;
    },
    async loadRecipes(context) {
      const result = await dbRecipes.allDocs({
        include_docs: true,
        attachments: true
      });
      context.commit("setRecipes", result.rows);
    },
    async loadRecipe(context, id) {
      if (id) {
        context.commit("setLoading", true);
        const result = await dbRecipes.get(id);
        context.commit("setLoading", false);
        context.commit("setRecipe", result);
      }
    }
  },
  modules: {}
});
store.dispatch("loadRecipes");
export default store;
