<template>
  <div class="recipe">
    <button @click="saveRecipe">save</button>
    <router-link
      v-if="rawRecipe._id && rawRecipe.name"
      :to="{
        name: 'RecipeView',
        params: { id: rawRecipe._id, name: rawRecipe.name }
      }"
      >cancel</router-link
    >
    <h1><input type="text" v-model="rawRecipe.name" /></h1>
    <textarea
      class="recipe-description"
      v-model="rawRecipe.description"
    ></textarea>
    TODO image upload or link?
    <p>{{ rawRecipe.image }}</p>

    <p>Cuisine <input v-model="rawRecipe.recipeCuisine" /></p>
    <p>Category <input v-model="rawRecipe.recipeCategory" /></p>
    <p>keywords <input v-model="rawRecipe.keywords" /></p>
    <p>
      <input type="text" v-model="rawRecipe.url" /><button
        @click="importFromUrl"
      >
        import
      </button>
      <input type="text" v-model="rawRecipe.author" /> TODO fix author
    </p>

    <p>
      <span v-t="'prepTime'"></span>
      <duration-edit v-model="rawRecipe.prepTime"></duration-edit>
    </p>

    <p>
      <span v-t="'cookTime'"></span>
      <duration-edit v-model="rawRecipe.cookTime"></duration-edit>
    </p>

    <p>
      <span v-t="'totalTime'"></span>
      <duration-edit v-model="rawRecipe.totalTime"></duration-edit>
    </p>

    <p>
      <span v-t="'recipeYield'"></span>
      <input type="text" v-model="rawRecipe.recipeYield" />
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
      rawRecipe: {
        _id: "",
        name: "",
        description: "",
        url: "",
        author: "",
        recipeCuisine: "",
        recipeCategory: "",
        keywords: "",
        image: [],
        prepTime: "",
        cookTime: "",
        totalTime: "",
        recipeYield: "",
        recipeIngredient: [],
        recipeInstructions: []
      }
    };
  },
  computed: {
    recipeIngredientEdit: {
      get() {
        return this.rawRecipe.recipeIngredient
          ? this.rawRecipe.recipeIngredient.join("\n")
          : "";
      },
      set(text) {
        this.rawRecipe.recipeIngredient = text.split("\n");
      }
    },
    // TODO suport sections?
    recipeInstructionsEdit: {
      get() {
        return this.rawRecipe.recipeInstructions
          ? this.rawRecipe.recipeInstructions
              .map(step => step.text)
              .join("\n\n")
          : "";
      },
      set(text) {
        this.rawRecipe.recipeInstructions = text
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
    this.$store.dispatch("loadRecipe", this.$route.params.id);
  },
  watch: {
    $route() {
      this.$store.dispatch("loadRecipe", this.$route.params.id);
    },
    "$store.state.recipe"(recipe) {
      this.rawRecipe = Object.assign(this.rawRecipe, recipe);
    }
  },
  methods: {
    async saveRecipe() {
      const action =
        this.$route.name === "RecipeNew" ? "createRecipe" : "saveRecipe";
      const result = await this.$store.dispatch(action, this.rawRecipe);
      console.log("result", result);
      this.$router.push({
        name: "RecipeView",
        params: { id: result.id, name: this.rawRecipe.name }
      });
    },
    async importFromUrl() {
      fetch(
        `https://us-central1-my-food-tracker-001.cloudfunctions.net/scrape_recipe?url=${this.rawRecipe.url}`
      )
        .then(r => r.json())
        .then(recipe => {
          this.rawRecipe = Object.assign({}, this.rawRecipe, recipe);
        });
    }
  },
  components: {
    DurationEdit
  }
};
</script>

<style></style>
