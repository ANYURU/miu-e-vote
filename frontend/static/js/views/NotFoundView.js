import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("404");
  }

  async getHtml() {
    return `
              <p>
                  404, Resource not found
              </p>
          `;
  }
}
