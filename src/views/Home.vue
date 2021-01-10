<template>
  <div class="home">
    <h1 v-if="isLoading">Loading</h1>
    <img alt="Vue logo" src="../assets/logo.png" />
    <ul>
      <li v-for="r in recipes" :key="r.id">
        <router-link
          :to="{ name: 'RecipeView', params: { id: r.id, name: r.name } }"
          >{{ r.name }}</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Home",
  computed: {
    isLoading() {
      return this.$store.isLoading;
    },
    recipes() {
      return this.$store.state.recipes.map(r => {
        return {
          id: r.id,
          name: r.doc.name
        };
      });
    }
  }
};
</script>
