<template>
  <div class="recipe">
    <router-link :to="{ name: 'RecipeEdit', params: { id: recipe._id } }"
      >Edit</router-link
    >
    <h1>{{ recipe.name }}</h1>
    <p class="recipe-description">{{ recipe.description }}</p>
    <p><img v-if="recipe.image" :src="recipe.image[0]" /></p>
    <p>
      <a :href="recipe.url">{{ recipe.author }}</a>
    </p>

    TODO edit time component TODO add/remove times if 0?
    <p><span v-t="'prepTime'"></span> {{ recipe.prepTime }}</p>

    <p><span v-t="'cookTime'"></span> {{ recipe.cookTime }}</p>

    <p><span v-t="'totalTime'"></span> {{ recipe.totalTime }}</p>

    <p>
      <span v-t="'recipeYield'"></span>
      <button @click="currentYield--" :disabled="currentYield === 1">-</button>
      <button @click="currentYield++">+</button>
      <input type="number" v-model.number="currentYield" min="1" />
      TODO: save custom yield?
    </p>

    <table>
      <tr v-for="(ingredient, index) in recipe.recipeIngredient" :key="index">
        <td colspan="2" v-if="ingredient.ingredient.startsWith('#')">
          <h3>{{ ingredient.ingredient.replace(/#/g, "") }}</h3>
        </td>
        <td v-if="!ingredient.ingredient.startsWith('#')">
          <span class="amount">{{
            numberToFraction(adjustedAmount(ingredient.amount))
          }}</span
          >&nbsp;
          <span class="unit">{{ ingredient.unit }}</span>
        </td>
        <td v-if="!ingredient.ingredient.startsWith('#')">
          <span class="ingredient">{{ ingredient.ingredient }}</span>
        </td>
      </tr>
    </table>

    <ol>
      <li
        v-for="(step, index) in recipe.recipeInstructions"
        :key="`step${index}`"
        v-html="step.text"
        @click.capture="handleInstruction($event)"
      ></li>
    </ol>
  </div>
</template>

<script>
import moment from "moment";
import Ingreedy from "ingreedyjs";
import i18n from "@/plugins/i18n";
import * as Sentry from "@sentry/browser";

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
      currentYield: 0,
    };
  },
  mounted() {
    this.$store.dispatch("loadRecipe", this.$route.params.id);
  },
  computed: {
    recipe() {
      // format Recipe Schema Object for display
      const recipe = Object.assign({}, this.$store.state.recipe);

      // author object (Person or Organization) or text
      if (recipe.author && recipe.author.name) {
        recipe.author = recipe.author.name;
      }

      ["prepTime", "cookTime", "totalTime"].forEach((time) => {
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
      if (recipe.recipeIngredient) {
        recipe.recipeIngredient = recipe.recipeIngredient.map((ingredient) => {
          // TODO: use multiply like ingreedy-py?
          try {
            return Ingreedy.parse(ingredient.replace(/½/g, "0.5"));
          } catch (err) {
            if (Sentry) {
              Sentry.captureException(err);
            }
            return {
              ingredient: ingredient,
            };
          }
        });
      }

      // TODO: sections?
      // recipeInstructions extract ingredients and timer used in each step;
      // TODO: ingredidents order? ingredients not in list, ingredients not used
      // TODO: verbes action? glossary link
      if (recipe.recipeInstructions) {
        recipe.recipeInstructions = recipe.recipeInstructions.map((step) => {
          const copy = Object.assign({}, step);
          // nl2br
          copy.text = step.text.replace(/\n/g, "<br>");
          // timer
          // TODO detect verb before or after
          copy.text = copy.text.replace(
            /([\d-]+ ?min)/gi,
            '<span class="timer">$1</span>'
          );
          copy.text = copy.text.replace(
            /([\d-]+ ?°C)/gi,
            '<span class="temp">$1</span>'
          );
          copy.text = copy.text.replace(
            /([\d-]+ ?cm)/g,
            '<span class="size">$1</span>'
          );
          return copy;
        });
      }

      return recipe;
    },
  },
  methods: {
    handleInstruction(event) {
      if (event.target.classList.contains("timer")) {
        console.log("create timer");
      }
    },
    adjustedAmount(value) {
      if (value && !isNaN(value)) {
        return (
          (parseFloat(value) / this.recipe.recipeYield) * this.currentYield
        );
      }
      return value;
    },
    numberToFraction(value) {
      if (value === 0.25) {
        return "¼";
      }
      if (value === 1 / 3) {
        return "⅓";
      }
      if (value === 0.5) {
        return "½";
      }
      if (value === 2 / 3) {
        return "⅔";
      }
      if (value === 0.75) {
        return "¾";
      }
      return value;
    },
  },
  watch: {
    "recipe.recipeYield": {
      handler(value) {
        this.currentYield = value;
      },
      immediate: true,
    },
    $route() {
      this.$store.dispatch("loadRecipe", this.$route.params.id);
    },
  },
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

textarea {
  width: 100%;
  min-height: 300px;
  font-family: "Mulish", sans-serif;
}

.amount,
.unit {
  font-weight: 800;
}
.ingredient {
}

.timer {
  color: red;
}
.temp {
  color: blue;
}
.size {
  color: orange;
}
</style>
