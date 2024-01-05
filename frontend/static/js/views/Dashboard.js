import AbstractView from "./AbstractView.js";
import { supabaseClient } from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Dashboard");
  }

  async renderContent() {
    const contentContainer = document.createElement("div");
    contentContainer.id = "content";
    contentContainer.className =
      "flex h-screen w-screen relative overflow-hidden bg-grey-400 overflow-hidden";

    const sideBar = document.createElement("aside");
    sideBar.className =
      "flex flex-col items-center bg-success-500 h-full min-w-fit p-5";

    const navBrand = document.createElement("header");
    navBrand.className = "flex gap-x-3 h-fit w-fit";

    const logoImg = document.createElement("img");
    logoImg.className = "w-14 h-14 object-contain";
    logoImg.src = "/static/assets/images/miu-logo.png";
    logoImg.alt = "MIU Logo";
    navBrand.appendChild(logoImg);

    const navBrandTextContainer = document.createElement("div");
    navBrandTextContainer.className = "flex flex-col items-center";

    const logoText = document.createElement("span");
    logoText.textContent = "metropolitan";
    logoText.className = "text-[1.4rem] text-white uppercase font-semibold";
    navBrandTextContainer.appendChild(logoText);

    const logoText2 = document.createElement("span");
    logoText2.textContent = "international university";
    logoText2.className = "text-[0.725rem] text-white uppercase font-medium";
    navBrandTextContainer.append(logoText2);

    navBrand.appendChild(navBrandTextContainer);
    sideBar.appendChild(navBrand);

    const profile = document.createElement("figure");
    profile.className = "flex flex-col items-center my-10 gap-y-2 h-fit w-fit";

    const profilePhoto = document.createElement("img");
    profilePhoto.className =
      "h-24 w-24 bg-grey-100 rounded-full border-grey object-contain";
    profilePhoto.src = "/static/assets/images/profile.png";
    profilePhoto.alt = "MIU Logo";
    profile.appendChild(profilePhoto);

    const username = document.createElement("figcaption");
    // Add the fetched user's name to this area. For now let's use name
    const name = "leticia namika";
    username.className =
      "capitalize text-white max-w-48 text-center";
    username.textContent = name;

    profile.appendChild(username);

    sideBar.appendChild(navBrand);
    sideBar.appendChild(profile);

    const viewArea = document.createElement("main");
    viewArea.className = "flex h-full w-full border border-danger-500";
    contentContainer.appendChild(sideBar);
    contentContainer.appendChild(viewArea);

    return contentContainer;
  }
}
