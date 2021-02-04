<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <select v-model="$i18n.locale">
      <option
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
        >{{ locale }}</option
      >
    </select>
  </div>
  <router-view />
</template>
<script>
/*
const recipes = require('../public/recipes.json');

export default {
  async mounted() {
    for(let i=0; i< recipes.length; i++) {
      console.log(recipes[i])
      await this.$store.dispatch("createRecipe", recipes[i])
    }
  }
}
*/
</script>
<style></style>
