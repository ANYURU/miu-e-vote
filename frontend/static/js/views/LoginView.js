import AbstractView from "./AbstractView.js";
import { supabaseClient, navigateTo } from "../index.js";
class LoginView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Login");
    this.supabaseClient = supabaseClient;
    this.formState = {
      email: "",
      password: "",
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
      password: [
        (value) => (value.length === 0 ? "Password is required" : undefined),
        (value) =>
          value.length >= 8 ? "" : "Password must be at least 8 characters",
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
    if (hasErrorAndTouched) {
      inputElement.classList.add(
        "focus:border-danger-500",
        "border-danger-500"
      );
      inputElement.classList.remove(
        "focus:border-success-500",
        "border-black-200"
      );
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
    title.className = "text-md font-semibold text-black-500";
    title.textContent = "Students Login";

    header.appendChild(logoImg);
    header.appendChild(title);

    const form = document.createElement("form");
    form.className = "flex flex-col gap-y-2 w-full";

    const emailInput = document.createElement("input");
    emailInput.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 focus:invalid:border-danger-500 bg-grey-100 rounded-md font-light text-sm required w-full";
    emailInput.type = "text";
    emailInput.name = "email";
    emailInput.id = "email";
    emailInput.placeholder = "Enter University Email";

    const emailError = document.createElement("p");
    emailError.id = "email-error-element";
    emailError.className = "text-xs font-light text-danger-500 invisible";
    emailError.textContent = "error";

    emailInput.addEventListener("input", this.handleInputChange);
    emailInput.addEventListener("blur", this.handleInputBlur);

    const passwordInput = document.createElement("input");
    passwordInput.className = `p-2 outline-none border border-black-200 focus:border-success-500 invalid:border-red-500 bg-grey-100 rounded-md font-light text-sm required w-full`;
    passwordInput.type = "password";
    passwordInput.name = "password";
    passwordInput.id = "password";
    passwordInput.placeholder = "••••••••••••••";
    // passwordInput.ariaInvalid = false;

    passwordInput.addEventListener("input", this.handleInputChange);
    passwordInput.addEventListener("blur", this.handleInputBlur);

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
    loginButton.disabled = this.formState.isSubmitting;

    loginButton.addEventListener("click", async (event) => {
      event.preventDefault();

      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;
      const email = emailInput.value;
      const password = passwordInput.value;

      this.validateField("email");
      this.validateField("password");

      if (Object.keys(this.formState.errors).length === 0) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Show the error to the user and return
          return;
        }

        if (data?.session) {
          navigateTo("/elections");
          // Alert the user that they have successfully logged in
        }
      }

      this.isSubmitting = false;
    });

    const linkContainer = document.createElement("div");
    linkContainer.className = "w-full flex flex-col items-center p-2";

    const signUp = document.createElement("span");
    signUp.className = "text-sm";
    signUp.textContent = "Are you a new student? ";

    const signUpAnchor = document.createElement("a");
    signUpAnchor.className = "text-success-500 hover:font-semibold";
    signUpAnchor.href = "/sign-up";
    signUpAnchor.textContent = "Sign Up";
    signUpAnchor.addEventListener("click", (event) => {
      event.preventDefault();
      navigateTo(event.target.href);
    });

    signUp.appendChild(signUpAnchor);

    const forgotPassword = document.createElement("span");
    forgotPassword.className = "text-sm";
    forgotPassword.textContent = "Forgot Password? ";

    const forgotPasswordAnchor = document.createElement("a");
    forgotPasswordAnchor.className = "text-success-500 hover:font-semibold";
    forgotPasswordAnchor.href = "/forgot-password";
    forgotPasswordAnchor.textContent = "Reset Password";
    forgotPasswordAnchor.addEventListener("click", (event) => {
      event.preventDefault();
      navigateTo(event.target.href);
    });

    forgotPassword.appendChild(forgotPasswordAnchor);

    linkContainer.appendChild(signUp);
    linkContainer.appendChild(forgotPassword);

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
