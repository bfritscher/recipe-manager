<template>
  <div class="recipe">
    <h1><input type="text" v-model="raw_recipe.name" /></h1>
    <textarea
      class="recipe-description"
      v-model="raw_recipe.description"
    ></textarea>
    TODO image upload or link?
    <p>{{ raw_recipe.image }}</p>
    <p>
      <input type="text" v-model="raw_recipe.url" />
      <input type="text" v-model="raw_recipe.author" /> TODO fix author
    </p>

    <p>
      <span v-t="'prepTime'"></span>
      <duration-edit v-model="raw_recipe.prepTime"></duration-edit>
    </p>

    <p>
      <span v-t="'cookTime'"></span>
      <duration-edit v-model="raw_recipe.cookTime"></duration-edit>
    </p>

    <p>
      <span v-t="'totalTime'"></span>
      <duration-edit v-model="raw_recipe.totalTime"></duration-edit>
    </p>

    <p>
      <span v-t="'recipeYield'"></span>
      <input type="text" v-model="raw_recipe.recipeYield" />
    </p>

    <textarea v-model.lazy="recipeIngredientEdit"></textarea>

    <textarea v-model.lazy="recipeInstructionsEdit"></textarea>
  </div>
</template>

<script>
import DurationEdit from "@/components/DurationEdit";

export default {
  name: "RecipeEdit",
  data() {
    return {
      raw_recipe: {}
    };
  },
  computed: {
    recipeIngredientEdit: {
      get() {
        return this.raw_recipe.recipeIngredient
          ? this.raw_recipe.recipeIngredient.join("\n")
          : "";
      },
      set(text) {
        this.raw_recipe.recipeIngredient = text.split("\n");
      }
    },
    // TODO suport sections?
    recipeInstructionsEdit: {
      get() {
        return this.raw_recipe.recipeInstructions
          ? this.raw_recipe.recipeInstructions
              .map(step => step.text)
              .join("\n\n")
          : "";
      },
      set(text) {
        this.raw_recipe.recipeInstructions = text
          .split("\n\n")
          .filter(text => text.trim())
          .map(text => {
            return {
              "@type": "HowToStep",
              text: text.trim()
            };
          });
      }
    }
  },
  mounted() {
    fetch("/test.json")
      .then(r => r.json())
      .then(r => (this.raw_recipe = r));
  },
  components: {
    DurationEdit
  }
};
</script>

<style></style>
