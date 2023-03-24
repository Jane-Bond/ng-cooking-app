import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";
import * as fromApp from "../store/app.reducer";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     "Italian Pizza",
  //     "Classic italian homemade pizza recipe",
  //     "https://st3.depositphotos.com/2370557/16471/i/600/depositphotos_164719502-stock-photo-pepperoni-pizza-with-fresh-ingredients.jpg",
  //     [
  //       new Ingredient("dry yeast", 1),
  //       new Ingredient("bread flour", 4),
  //       new Ingredient("extra virgin olive oil", 2),
  //       new Ingredient("tomato sauce", 1),
  //       new Ingredient("mozzarella cheese", 1),
  //       new Ingredient("parmesan cheese", 1),
  //       new Ingredient("mushrooms", 4),
  //       new Ingredient("olives", 5),
  //     ]
  //   ),
  //   new Recipe(
  //     "The Classic Burger",
  //     "Best burger recipe",
  //     "https://st3.depositphotos.com/1000504/18241/i/600/depositphotos_182414346-stock-photo-fresh-tasty-burger.jpg",
  //     [
  //       new Ingredient("beef", 1),
  //       new Ingredient("onion", 1),
  //       new Ingredient("hamburger buns", 4),
  //       new Ingredient("ketchup", 1),
  //       new Ingredient("mayonnaise", 1),
  //       new Ingredient("lettuce leaves,", 2),
  //       new Ingredient("firm-ripe tomato,", 1),
  //     ]
  //   ),
  // ];
  private recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.AppState>) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingLIst(ingredients: Ingredient[]) {
    // this.slService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
