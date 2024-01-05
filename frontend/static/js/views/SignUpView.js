import AbstractView from "./AbstractView.js";
import { navigateTo, supabaseClient } from "../index.js";

export default class SignUpView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Sign Up");
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
    title.className = "text-md font-semibold text-black-500 capitalize";
    title.textContent = "New Student's Login";

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

    emailInput.addEventListener("change", (event) => {
      console.log("email: ", event.target.value);
    });

    emailInput.addEventListener("blur", (event) => {
      console.log("email: ", event.target.value);
    });

    const sendOtpButton = document.createElement("button");
    sendOtpButton.className =
      "w-full p-2 font-medium rounded-md text-grey-100 bg-success-500 hover:bg-popup-100 hover:text-popup-600 hover:cursor-pointer disabled:cursor-normal";
    sendOtpButton.id = "send-otp-cta";
    sendOtpButton.type = "button";
    sendOtpButton.textContent = "Send OTP";

    sendOtpButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const email = emailInput.value;
      localStorage.setItem("email", email);

      const { data } = await this.supabaseClient.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      });

      navigateTo("/verify-otp");
      console.log("Data: ", data);
    });

    const linkContainer = document.createElement("div");
    linkContainer.className = "w-full flex flex-col items-center p-2";

    const loginLink = document.createElement("span");
    loginLink.className = "text-sm";
    loginLink.innerHTML =
      'Already have an account? <a class="text-success-500 hover:font-semibold" href="/" data-link>Login</a>';

    linkContainer.appendChild(loginLink);

    form.appendChild(emailInput);
    form.appendChild(emailError);
    form.appendChild(sendOtpButton);

    formContainer.appendChild(header);
    formContainer.appendChild(form);
    formContainer.appendChild(linkContainer);

    contentContainer.appendChild(formContainer);
    return contentContainer;
  }
}
