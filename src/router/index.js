import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import RecipeView from "../components/RecipeView.vue";
import RecipeEdit from "../components/RecipeEdit.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/recipe/:name/:id",
    name: "RecipeView",
    component: RecipeView
  },
  {
    path: "/recipe/:id/edit",
    name: "RecipeEdit",
    component: RecipeEdit
  },
  {
    path: "/recipe/new",
    name: "RecipeNew",
    component: RecipeEdit
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
