import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("404");
  }

  async renderContent() {
    const paragraph = document.createElement("p");
    paragraph.textContent = "404, Resource not found";

    return paragraph;
  }
}
