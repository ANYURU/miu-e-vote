import AbstractView from "./AbstractView.js";
import { supabaseClient, navigateTo } from "../index.js";

class SetPasswordView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Set Password");
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
    // setPasswordButton.disabled = !this.checkPasswordValidity();

    setPasswordButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const password = passwordInput.value;

      const {
        data: {
          user: { id },
        },
      } = await supabaseClient.auth.getUser();

      console.log("User Id: ", id);

      try {
        const { data: user } = await supabaseClient
          .from("users")
          .select("isPasswordSet")
          .eq("user_id", id)
          .limit(1)
          .single();

        if (!user) {
          await supabaseClient.from("users").insert({
            user_id: id,
            isPasswordSet: true,
          });

          await supabaseClient.auth.updateUser({
            password: password,
          });

          navigateTo("/elections");
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

    input.addEventListener("input", (event) => {
      this.clearErrorMessages(input, id);
      console.log(`${id}: `, event.target.value);

      if (id === "password-confirm") {
        this.checkPasswordMatching();
      }

      if (id === "password") {
        this.checkPasswordValidity();
      }
    });

    input.addEventListener("blur", () => {
      const passwordError = document.getElementById("password-error");
      const passwordConfirmError = document.getElementById(
        "password-confirm-error"
      );

      if (!input.value?.length > 0 && id === "password") {
        passwordError.classList.remove("invisible");
        passwordError.classList.add("visible");
        passwordError.textContent = "Password is required";
        input.classList.remove("focus:border-success-500");
        input.classList.add("border-danger-500");
      } else if (input.value && id === "password") {
        passwordError.classList.add("invisible");
        passwordError.classList.add("visible");
        passwordError.textContent = "error";
        input.classList.remove("border-danger-500");
        input.classList.add("focus:border-success-500");
      }

      if (!input.value?.length > 0 && id === "password-confirm") {
        passwordConfirmError.classList.remove("invisible");
        passwordConfirmError.classList.add("visible");
        passwordConfirmError.textContent = "Password comfirmation is required";
        input.classList.remove("focus:border-success-500");
        input.classList.add("border-danger-500");
      } else if (input.value && id === "password-confirm") {
        passwordConfirmError.classList.add("invisible");
        passwordConfirmError.classList.add("visible");
        passwordConfirmError.textContent = "error";
        input.classList.remove("border-danger-500");
        input.classList.add("focus:border-success-500");
      }
    });

    return input;
  }

  createErrorElement(id) {
    const errorElement = document.createElement("p");
    errorElement.id = `${id}-error`;
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

  displayErrorMessages(input, id) {
    const errorElement = document.getElementById(`${id}-error`);

    if (errorElement) {
      if (!input.checkValidity()) {
        errorElement.textContent = input.validationMessage;
        errorElement.classList.add("visible");
        errorElement.classList.remove("invisible");
        input.classList.add("border-danger-500");
      }
    }
  }

  checkPasswordValidity() {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("password-error");

    if (passwordInput && passwordError) {
      if (passwordInput?.value && passwordInput?.value?.length < 7) {
        passwordError.textContent =
          "Password should be 8 or more characters long";
        passwordError.classList.remove("invisible");
        passwordError.classList.add("visible");
        passwordInput.classList.add("border-danger-500");
        passwordInput.classList.remove("focus:border-success-500");
        return false;
      } else {
        passwordInput.classList.add("focus:border-success-500");
        passwordInput.classList.remove("border-danger-500");
        passwordInput.classList.remove("border-danger-500");
        passwordError.classList.remove("visible");
        passwordError.classList.add("invisible");
        return true;
      }
    }
  }
  checkPasswordMatching() {
    const passwordInput = document.getElementById("password");
    const passwordConfirmInput = document.getElementById("password-confirm");
    const passwordError = document.getElementById("password-error");
    const passwordConfirmError = document.getElementById(
      "password-confirm-error"
    );

    if (
      passwordInput &&
      passwordConfirmInput &&
      passwordError &&
      passwordConfirmError
    ) {
      if (passwordInput.value !== passwordConfirmInput.value) {
        passwordConfirmError.textContent = "Passwords do not match";
        passwordInput.classList.remove("focus:border-success-500");
        passwordConfirmInput.classList.add("border-danger-500");
        passwordConfirmError.classList.remove("invisible");
        passwordConfirmError.classList.add("visible");
      } else {
        passwordInput.classList.remove("border-danger-500");
        passwordInput.classList.add("focus:border-success-500");
        passwordConfirmInput.classList.remove("border-danger-500");
        passwordConfirmError.classList.remove("visible");
        passwordConfirmError.classList.add("invisible");
      }
    }
  }
}

export default SetPasswordView;
