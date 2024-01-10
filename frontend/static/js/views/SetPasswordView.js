import AbstractView from "./AbstractView.js";
import { supabaseClient, navigateTo } from "../index.js";

class SetPasswordView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Set Password");
    this.supabaseClient = supabaseClient;
    this.formState = {
      password: "",
      "password-confirm": "",
      errors: {},
      touched: {},
      isSubmitting: false,
    };

    this.validationSchema = {
      password: [
        (value) => (value.length === 0 ? "Password is required" : ""),
        (value) =>
          value.length >= 8 ? "" : "Password must be at least 8 characters",
      ],
      "password-confirm": [
        (value) => (value.length === 0 ? "Password Confirm is required" : ""),
        (value) =>
          this.formState.password && this.formState.password !== value
            ? "Passwords do not match"
            : "",
      ],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
  }

  handleInputChange(event) {
    const { name: fieldName, value } = event.target;

    this.formState[fieldName] = value;

    this.validateField("password");
    this.validateField("password-confirm");
    console.log("Form state: ", this.formState);
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
    title.textContent = "Set Password";

    header.appendChild(logoImg);
    header.appendChild(title);

    const form = document.createElement("form");
    form.className = "flex flex-col gap-y-2 w-full";

    const passwordInput = this.createInput("password", "Enter Password", true);
    const passwordConfirmInput = this.createInput(
      "password-confirm",
      "Confirm Password",
      true
    );

    const passwordError = this.createErrorElement("password");
    const passwordConfirmError = this.createErrorElement("password-confirm");
    const setPasswordButton = document.createElement("button");
    setPasswordButton.className =
      "w-full p-2 font-medium rounded-md text-grey-100 bg-success-500 hover:bg-popup-100 hover:text-popup-600 hover:cursor-pointer disabled:cursor-normal";
    setPasswordButton.id = "set-password-cta";
    setPasswordButton.type = "button";
    setPasswordButton.textContent = "Set Password";
    setPasswordButton.disabled = this.isSubmitting;

    setPasswordButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const password = passwordInput.value;

      const {
        data: {
          user: { id },
        },
      } = await supabaseClient.auth.getUser();

      try {
        const {
          data: { is_password_set },
          error,
        } = await supabaseClient
          .from("users")
          .select(`is_password_set`)
          .eq("user_id", id)
          .limit(1)
          .single();

        if (error) throw error;

        if (!is_password_set) {
          const { data, error } = await supabaseClient
            .from("users")
            .update({
              is_password_set: true,
            })
            .eq("user_id", id);

          if (error) throw error;

          if (data) {
            await supabaseClient.auth.updateUser({
              password: password,
            });

            navigateTo("/elections");
          }
        } else {
          // Notify the user that they are already registered.
        }
      } catch (error) {
        // Notify the user about the error
      }
    });

    const linkContainer = document.createElement("div");
    linkContainer.className = "w-full flex flex-col items-center p-2";

    form.appendChild(passwordInput);
    form.appendChild(passwordError);
    form.appendChild(passwordConfirmInput);
    form.appendChild(passwordConfirmError);
    form.appendChild(setPasswordButton);

    formContainer.appendChild(header);
    formContainer.appendChild(form);
    formContainer.appendChild(linkContainer);

    contentContainer.appendChild(formContainer);
    return contentContainer;
  }

  createInput(id, placeholder, isPassword) {
    const input = document.createElement("input");
    input.className =
      "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-100 rounded-md font-light text-sm required w-full";
    input.type = isPassword ? "password" : "text";
    input.name = id;
    input.id = id;
    input.placeholder = placeholder;
    input.required = true;

    input.addEventListener("input", (event) => this.handleInputChange(event));
    input.addEventListener("blur", (event) => this.handleInputBlur(event));

    return input;
  }

  createErrorElement(id) {
    const errorElement = document.createElement("p");
    errorElement.id = `${id}-error-element`;
    errorElement.className = "text-xs font-light text-danger-500 invisible";
    errorElement.textContent = "error";
    return errorElement;
  }

  clearErrorMessages(input, id) {
    const errorElement = document.getElementById(`${id}-error`);
    if (errorElement) {
      errorElement.textContent = "error";
      errorElement.classList.remove("visible");
      errorElement.classList.add("invisible");
    }
    input.classList.remove("border-danger-500");
  }
}

export default SetPasswordView;
