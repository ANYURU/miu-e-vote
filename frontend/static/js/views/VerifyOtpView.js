import AbstractView from "./AbstractView.js";
import VanillaOTP from "../helpers/vanilla-otp.js";
import { supabaseClient, navigateTo } from "../index.js";

class VerifyOtpView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Verify OTP");
    this.vanillaOTP = null;
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

    // Create an OTP element with four input boxes
    const otpInput = document.createElement("div");
    otpInput.className = "flex gap-x-2 justify-evenly p-2 w-full";

    const otpBoxes = [];

    for (let i = 0; i < 6; i++) {
      const otpBox = document.createElement("input");
      otpBox.type = "text";
      otpBox.className =
        "p-2 outline-none border border-black-200 focus:border-success-500 bg-grey-500 rounded-md font-light text-sm required text-center align-center w-10";
      otpBoxes.push(otpBox);
      otpInput.appendChild(otpBox);
    }

    const verifyOtpButton = document.createElement("button");
    verifyOtpButton.className =
      "w-full p-2 font-medium rounded-md text-grey-100 bg-success-500 hover:bg-popup-100 hover:text-popup-600 hover:cursor-pointer disabled:cursor-normal";
    verifyOtpButton.id = "verify-otp-cta";
    verifyOtpButton.type = "button";
    verifyOtpButton.textContent = "Verify Otp";

    verifyOtpButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const enteredOtp = otpBoxes.map((box) => box.value).join("");
      this.vanillaOTP.setValue(enteredOtp);
      const email = localStorage.getItem("email");
      const { error } = await supabaseClient.auth.verifyOtp({
        email,
        token: enteredOtp,
        type: "email",
      });

      if (!error) {
        navigateTo("/set-password");
      }
    });

    const linkContainer = document.createElement("div");
    linkContainer.className = "w-full flex justify-between p-2";

    const resendOtpButton = document.createElement("button");
    resendOtpButton.className = "text-sm text-success-500 hover:font-semibold";
    resendOtpButton.textContent = "Resend OTP";
    resendOtpButton.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("Trigger the resend of the otp");
    });

    const changeEmailLink = document.createElement("span");
    changeEmailLink.className = "text-sm";
    changeEmailLink.innerHTML =
      '<a class="text-success-500 hover:font-semibold" href="/sign-up" data-link>Change Email</a>';

    linkContainer.appendChild(resendOtpButton);
    linkContainer.appendChild(changeEmailLink);

    // Append the OTP input and Verify button to the form
    form.appendChild(otpInput);
    form.appendChild(verifyOtpButton);

    formContainer.appendChild(header);
    formContainer.appendChild(form);
    formContainer.appendChild(linkContainer);

    // Initialize VanillaOTP instance with the form container and updateTo input
    this.vanillaOTP = new VanillaOTP(
      formContainer,
      this.vanillaOTPUpdateToInput
    );

    contentContainer.appendChild(formContainer);
    return contentContainer;
  }
}

export default VerifyOtpView;
