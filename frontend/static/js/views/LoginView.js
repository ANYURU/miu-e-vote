import AbstractView from "./AbstractView.js";
import { supabaseClient, navigateTo } from "../index.js";
class LoginView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Login");
    this.supabaseClient = supabaseClient;
  }
  async renderContent() {
    const contentContainer = document.createElement("div");
    contentContainer.id = "content";
    contentContainer.className =
      "min-h-screen w-screen flex justify-center items-center relative overflow-hidden bg-grey-400";

    const formContainer = document.createElement("div");
    formContainer.className =
      "flex flex-col gap-y-1 w-5/6 md:w-80 px-4 py-5 items-center bg-white rounded-md";

    const header = document.createElement("header");
    header.className = "flex flex-col items-center gap-y-0.5";

    const logoImg = document.createElement("img");
    logoImg.className = "w-20 h-20 object-contain";
    logoImg.src = "/static/assets/images/miu-logo.png";
    logoImg.alt = "MIU Logo";

    const title = document.createElement("h1");
    title.className = "text-md font-semibold text-black-500";
    title.textContent = "Students Login";

    header.appendChild(logoImg);
    header.appendChild(title);

    const form = document.createElement("form");
    form.className = "flex flex-col gap-y-2 w-full";

    const emailInput = document.createElement("input");
    emailInput.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-100 rounded-md font-light text-sm required w-full";
    emailInput.type = "email";
    emailInput.name = "email";
    emailInput.id = "email";
    emailInput.placeholder = "Enter University Email";
    emailInput.required = true;

    const emailError = document.createElement("p");
    emailError.id = "email-error-element";
    emailError.className = "text-xs font-light text-danger-500 invisible";
    emailError.textContent = "error";

    emailInput.addEventListener("blur", (event) => {
      console.log("email: ", event.target.value);
    });

    emailInput.addEventListener("change", (event) => {
      console.log("email: ", event.target.value);
    });

    const passwordInput = document.createElement("input");
    passwordInput.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-100 rounded-md font-light text-sm required w-full";
    passwordInput.type = "password";
    passwordInput.name = "password";
    passwordInput.id = "password";
    passwordInput.minLength = 8;
    passwordInput.placeholder = "••••••••••••••";
    passwordInput.required = true;

    passwordInput.addEventListener("change", (event) => {
      console.log("password: ", event.target.value);
    });

    passwordInput.addEventListener("blur", (event) => {
      console.log("password: ", event.target.value);
      passwordInput.checkValidity();
    });

    const passwordError = document.createElement("p");
    passwordError.id = "password-error-element";
    passwordError.className = "text-xs font-light text-danger-500 invisible";
    passwordError.textContent = "error";

    const loginButton = document.createElement("button");
    loginButton.className =
      "w-full p-2 font-medium rounded-md text-grey-100 bg-success-500 hover:bg-popup-100 hover:text-popup-600 hover:cursor-pointer disabled:cursor-normal";
    loginButton.id = "login-cta";
    loginButton.type = "button";
    loginButton.textContent = "Login";

    loginButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const email = emailInput.value;
      const password = passwordInput.value;

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        /**
         * Alert the user that there was an error logging in
         */
        console.log(error);
      }

      if (data?.session) {
        navigateTo("/elections");
        // Alert the user that they have successfully logged in
      }
    });

    const linkContainer = document.createElement("div");
    linkContainer.className = "w-full flex flex-col items-center p-2";

    const signUpLink = document.createElement("span");
    signUpLink.className = "text-sm";
    signUpLink.innerHTML =
      'Are you a new student? <a class="text-success-500 hover:font-semibold" href="/sign-up" data-link>Sign Up</a>';

    const forgotPasswordLink = document.createElement("span");
    forgotPasswordLink.className = "text-sm";
    forgotPasswordLink.innerHTML =
      'Forgot Password? <a class="text-success-500 hover:font-semibold" href="/forgot-password" data-link>Reset Password</a>';

    linkContainer.appendChild(signUpLink);
    linkContainer.appendChild(forgotPasswordLink);

    form.appendChild(emailInput);
    form.appendChild(emailError);
    form.appendChild(passwordInput);
    form.appendChild(passwordError);
    form.appendChild(loginButton);

    formContainer.appendChild(header);
    formContainer.appendChild(form);
    formContainer.appendChild(linkContainer);

    contentContainer.appendChild(formContainer);
    return contentContainer;
  }
}

export default LoginView;
