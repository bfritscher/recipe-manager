<template>
  <div class="home">
    <h1 v-if="isLoading">Loading</h1>
    <img alt="Vue logo" src="../assets/logo.png" />
    <ul>
      <li v-for="r in recipes" :key="r.id">
        <h2 v-if="r.type">{{ r.name }}</h2>
        <router-link
          v-else
          :to="{ name: 'RecipeView', params: { id: r.id, name: r.name } }"
          >{{ r.name }}</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
const recipes = require('../../public/recipes.json');
/*
a collection can be a cookbook
browse collection contents
search filter recipes by ingredients, title, description? tags, category?
how to show collections overviews
schema to store collections
*/

export default {
  name: "Home",
  computed: {
    isLoading() {
      return this.$store.isLoading;
    },
    recipes() {
      return recipes;
      /*
      return this.$store.state.recipes.map(r => {
        return {
          id: r.id,
          name: r.doc.name
        };
      });
      */
    }
  }
};
</script>
