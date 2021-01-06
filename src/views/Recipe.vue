<template>
  <div class="recipe">
    <h1>{{ recipe.name }}</h1>
    <p class="recipe-description">{{ recipe.description }}</p>
    <p><img v-if="recipe.image" :src="recipe.image[0]" /></p>
    <p>
      <a :href="recipe.url">{{ recipe.author }}</a>
    </p>

    <p><span v-t="'prepTime'"></span> {{ recipe.prepTime }}</p>

    <p><span v-t="'cookTime'"></span> {{ recipe.cookTime }}</p>

    <p><span v-t="'totalTime'"></span> {{ recipe.totalTime }}</p>

    <p><span v-t="'recipeYield'"></span> {{ recipe.recipeYield }}</p>

    <ul>
      <li v-for="(ingredient, index) in recipe.recipeIngredient" :key="index">
        {{ ingredient }}
      </li>
    </ul>

    <p v-for="(step, index) in recipe.recipeInstructions" :key="`step${index}`">
      {{ step.text }}
    </p>
  </div>
</template>

<script>
import moment from "moment";
import i18n from "@/plugins/i18n";

function formatDuration(iso8601Duration) {
  const duration = moment.duration(iso8601Duration);
  const hours = duration.hours();
  const minutes = duration.minutes();
  let out = "";
  if (hours > 0) {
    out += `${hours} ${i18n.global.t("h")} `;
  }
  if (minutes > 0) {
    out += `${minutes} ${i18n.global.t("min")}`;
  }
  return out;
}

export default {
  name: "Recipe",
  data() {
    return {
      raw_recipe: {}
    };
  },
  computed: {
    recipe() {
      // format Recipe Schema Object for display
      const recipe = Object.assign({}, this.raw_recipe);

      // author object (Person or Organization) or text
      if (recipe.author && recipe.author.name) {
        recipe.author = recipe.author.name;
      }

      ["prepTime", "cookTime", "totalTime"].forEach(time => {
        if (Object.prototype.hasOwnProperty.call(recipe, time)) {
          recipe[time] = formatDuration(recipe[time]);
        }
      });

      // recipeYield extract number
      if (recipe.recipeYield) {
        if (isNaN(recipe.recipeYield)) {
          recipe.recipeYield = recipe.recipeYield.replace(/[^\d]/g, "");
        }
        recipe.recipeYield = parseInt(recipe.recipeYield);
      }

      // TODO: handle image list or url

      // TODO: use inLanguage for ingredient qty convertions?

      // TODO: aggregateRating?

      // for filtering but not display?
      // recipeCuisine
      // recipeCategory can be multiple ,
      // keywords  can be multiple ,

      // TODO: partOf?

      // nutrition ignore for now

      // TODO: keep track of cooking multiple sessions?
      /// recipeIngredient extract qty and units?;

      // TODO: sections?
      // recipeInstructions extract ingredients and timer used in each step;

      return recipe;
    }
  },
  mounted() {
    fetch("/test.json")
      .then(r => r.json())
      .then(r => (this.raw_recipe = r));
  }
};
</script>

<style>
body {
  font-family: "Mulish", sans-serif;
  font-weight: 400;
}

h1 {
  font-family: "Lora", serif;
  text-transform: uppercase;
  font-weight: 400;
}

.recipe-description {
  font-family: "Lora", serif;
  font-weight: 400;
  font-style: italic;
}
</style>
