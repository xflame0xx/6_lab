import { MainPage } from "./pages/MainPage.js";
import { UserPage } from "./pages/UserPage.js";

export class Router {
  constructor(root) {
    this.root = root;
  }

  navigateToMain() {
    this.root.innerHTML = '';
    new MainPage(this.root, (user) => this.navigateToUser(user)).render();
  }

  navigateToUser(user) {
    this.root.innerHTML = '';
    new UserPage(this.root, user, () => this.navigateToMain()).render();
  }
}