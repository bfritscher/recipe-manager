<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/recipe">Recipe</router-link>
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

<style></style>
