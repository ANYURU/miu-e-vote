import AbstractView from "./AbstractView.js";
import { navigateTo, supabaseClient } from "../index.js";

export default class SignUpView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Sign Up");
    this.supabaseClient = supabaseClient;
    this.formState = {
      email: "",
      errors: {},
      touched: {},
      isSubmitting: false,
    };

    this.validationSchema = {
      email: [
        (value) => (value.length === 0 ? "Email is required" : ""),
        (value) =>
          value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
            ? undefined
            : "Invalid email address",
      ],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
  }

  handleInputChange(event) {
    const { name: fieldName, value } = event.target;
    this.formState[fieldName] = value;
    this.validateField(fieldName);
  }

  handleInputBlur(event) {
    const { name: fieldName } = event.target;
    this.formState.touched[fieldName] = true;
    this.validateField(fieldName);
  }

  validateField(fieldName) {
    if (this.formState.errors[fieldName]) {
      delete this.formState.errors[fieldName];
    }

    for (const checkValidity of this.validationSchema[fieldName]) {
      const errorMessage = checkValidity(this.formState[fieldName]);
      if (errorMessage) {
        this.formState.errors[fieldName] = errorMessage;
        break;
      }
    }

    this.updateAriaInvalid(fieldName);
    this.showHideError(fieldName);
  }

  hasErrorAndTouched(fieldName) {
    return (
      (this.formState.errors[fieldName] && this.formState.touched[fieldName]) ||
      false
    );
  }

  updateAriaInvalid(fieldName) {
    const hasErrorAndTouched = this.hasErrorAndTouched(fieldName);
    const inputElement = document.getElementById(fieldName);

    console.log("here", hasErrorAndTouched);
    if (hasErrorAndTouched) {
      inputElement.classList.add(
        "focus:border-danger-500",
        "border-danger-500"
      );
      inputElement.classList.remove(
        "focus:border-success-500",
        "border-black-200"
      );

      console.log("Input element classlist: ", inputElement.classList);
      return;
    }

    if (!hasErrorAndTouched) {
      inputElement.classList.add(
        "focus:border-success-500",
        "border-black-200"
      );
      inputElement.classList.remove(
        "focus:border-danger-500",
        "border-danger-500"
      );
    }
  }

  showHideError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error-element`);
    const hasErrorAndTouched = this.hasErrorAndTouched(fieldName);

    if (hasErrorAndTouched) {
      errorElement.textContent = this.formState.errors[fieldName];
      errorElement.classList.remove("invisible");
      return;
    }

    errorElement.classList.add("invisible");
    errorElement.textContent = "error";
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
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-100 rounded-md font-light text-sm w-full";
    emailInput.type = "email";
    emailInput.name = "email";
    emailInput.id = "email";
    emailInput.placeholder = "Enter University Email";

    const emailError = document.createElement("p");
    emailError.id = "email-error-element";
    emailError.className = "text-xs font-light text-danger-500 invisible";
    emailError.textContent = "error";

    emailInput.addEventListener("input", this.handleInputChange);
    emailInput.addEventListener("blur", this.handleInputBlur);

    const sendOtpButton = document.createElement("button");
    sendOtpButton.className =
      "w-full p-2 font-medium rounded-md text-grey-100 bg-success-500 hover:bg-popup-100 hover:text-popup-600 hover:cursor-pointer disabled:cursor-normal";
    sendOtpButton.id = "send-otp-cta";
    sendOtpButton.type = "button";
    sendOtpButton.textContent = "Send OTP";
    sendOtpButton.disabled = this.formState.isSubmitting;

    sendOtpButton.addEventListener("click", async (event) => {
      event.preventDefault();

      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;
      const email = emailInput.value;

      this.validateField("email");

      if (Object.keys(this.formState.errors).length == 0) {
        const { data, error } = await this.supabaseClient.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: true,
          },
        });

        if (error) {
          // Show the user the error and redirect and return
          return;
        }

        if (data) {
          localStorage.setItem("email", email);
          navigateTo("/verify-otp");
        }
      }

      this.isSubmitting = false;
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
