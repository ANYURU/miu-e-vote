import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params, supabaseClient) {
    super(params);
    this.setTitle("Settings");
    this.supabaseClient = supabaseClient
  }

  async getHtml() {
    return `
            <h1>Settings</h1>
            <p>Manage your privacy and configuration.</p>
        `;
  }
}
