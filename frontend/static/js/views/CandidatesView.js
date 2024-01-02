import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

  constructor(supabase) {
    super();
    this.setTitle("candidates");
    
  }

  

  getHtml () {
    // Construct the protected layout render the side bar and render
    // 
    return "<h1>Candidates</h1>"
  }


}
