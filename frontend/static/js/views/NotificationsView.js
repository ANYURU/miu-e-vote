import AbstractView from "./AbstractView.js";
import { supabaseClient } from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Notifications");
    this.openNav = false;
  }

  async renderContent() {
    const layout = await this.renderProtectedLayout();
    return layout;
  }
}
