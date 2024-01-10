import { navigateTo, supabaseClient } from "../index.js";
export default class {
  constructor(params) {
    this.params = params;
    this.signingOut = false;
  }

  menuItems = {
    admin: [
      {
        path: "/elections",
        text: "elections",
        icon: `
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5.175 16h13.65l-1.95-2.2l1.425-1.425L21 15.45V22H3v-6.55l2.75-3.125l1.425 1.425l-2 2.25Zm6.85-.175L5.7 9.45l7.75-7.75l6.375 6.325l-7.8 7.8Zm.025-2.875L17 8l-3.55-3.5L8.5 9.45l3.55 3.5Z"></path>
          </svg>
      `,
      },
      {
        path: "/candidates",
        text: "candidates",
        icon: `
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
          </svg>
        `,
      },
      {
        path: "/notifications",
        text: "notifications",
        icon: `
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-10 fill-grey-100 hover:fill-popup-600">
            <path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
          </svg>
        `,
      },
      {
        path: "/results",
        text: "results",
        icon: `
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="currentColor" d="M32 9a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V9ZM19 21a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V21ZM9 30a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H9Z"></path>
          </svg>
        `,
      },
    ],
    student: [
      {
        path: "/elections",
        text: "elections",
        icon: `
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5.175 16h13.65l-1.95-2.2l1.425-1.425L21 15.45V22H3v-6.55l2.75-3.125l1.425 1.425l-2 2.25Zm6.85-.175L5.7 9.45l7.75-7.75l6.375 6.325l-7.8 7.8Zm.025-2.875L17 8l-3.55-3.5L8.5 9.45l3.55 3.5Z"></path>
          </svg>
        `,
      },
      {
        path: "/apply",
        text: "apply",
        icon: `
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
          </svg>
        `,
      },
      {
        path: "/notifications",
        text: "notifications",
        icon: `
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-10 fill-grey-100 hover:fill-popup-600">
            <path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
          </svg>
        `,
      },
      {
        path: "/results",
        text: "results",
        icon: `
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="currentColor" d="M32 9a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V9ZM19 21a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V21ZM9 30a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H9Z"></path>
          </svg>
        `,
      },
    ],
    shared: [
      {
        path: "/profile",
        text: "profile",
        icon: `
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
      `,
      },
    ],
  };

  setTitle(title) {
    document.title = title;
  }

  getMenuItems(role) {
    return this.menuItems[role] || this.menuItems["student"];
  }

  async getUserRole() {
    const role = "student";
    return role;
  }

  generateNavLink({ path, text, icon }) {
    const navLink = document.createElement("a");
    navLink.href = path;
    navLink.className = `w-full flex items-center gap-x-4 ${
      window.location.pathname.startsWith(path)
        ? "text-popup-600"
        : "text-grey-100"
    } hover:text-popup-600 hover:bg-popup-100 pl-3 pr-5 py-1 rounded-lg`;

    navLink.setAttribute("data-link", "");

    navLink.innerHTML = icon;
    const textSpan = document.createElement("span");
    textSpan.className = "capitalize";
    textSpan.textContent = text;

    navLink.appendChild(textSpan);
    return navLink;
  }

  renderLoader() {
    return `
      <div role="status" class="absolute h-fit w-fit">
        <svg aria-hidden="true" class="w-8 h-8 text-grey-100 animate-spin dark:text-gray-600 fill-success-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only text-xs">Loading...</span>
      </div>
    `;
  }

  async renderProtectedLayout() {
    const contentContainer = document.createElement("div");
    contentContainer.id = "content";
    contentContainer.className =
      "flex flex-col md:flex-row h-screen w-screen relative overflow-hidden bg-grey-400 overflow-hidden overscroll-contain";

    const sideBar = document.createElement("aside");
    sideBar.className =
      "hidden md:flex flex-col items-center bg-success-500 h-full min-w-fit p-5";

    const navBar = document.createElement("div");
    navBar.className =
      "flex md:hidden px-5 justify-between items-center w-full min-h-fit bg-success-500 border border-red-500";

    const navBrand = document.createElement("header");
    navBrand.className = "flex gap-x-1.5 md:gap-x-3 h-fit w-fit";

    const logoImg = document.createElement("img");
    logoImg.className = "w-10 h-10 md:w-14 md:h-14 object-contain";
    logoImg.src = "/static/assets/images/miu-logo.png";
    logoImg.alt = "MIU Logo";
    navBrand.appendChild(logoImg);

    const navBrandTextContainer = document.createElement("div");
    navBrandTextContainer.className = "flex flex-col items-center";

    const logoText = document.createElement("span");
    logoText.textContent = "metropolitan";
    logoText.className =
      "text-[1rem] md:text-[1.4rem] text-white uppercase font-semibold";
    navBrandTextContainer.appendChild(logoText);

    const logoText2 = document.createElement("span");
    logoText2.textContent = "international university";
    logoText2.className =
      "text-[0.525rem] md:text-[0.725rem] text-white uppercase font-medium";
    navBrandTextContainer.append(logoText2);

    navBrand.appendChild(navBrandTextContainer);

    const navBarButton = document.createElement("button");
    navBarButton.className = "w-6 h-6 md:w-8 md:h-8 text-white";
    navBarButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M0 96c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm448 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h384c17.7 0 32 14.3 32 32z"></path>
      </svg>
    `;
    navBarButton.addEventListener("click", (event) => {
      event.preventDefault();
      // Hide and show the mobile nav
      console.log("Toggled the mobile nav");
    });

    navBar.appendChild(navBrand.cloneNode(true));
    navBar.appendChild(navBarButton);
    sideBar.appendChild(navBrand);

    const profile = document.createElement("figure");
    profile.className =
      "flex flex-col items-center mt-8 mb-5 gap-y-2 h-fit w-fit";

    const profilePhoto = document.createElement("img");
    profilePhoto.className =
      "h-24 w-24 bg-grey-100 rounded-full border-grey object-contain";
    profilePhoto.src = "/static/assets/images/profile.png";
    profilePhoto.alt = "MIU Logo";
    profile.appendChild(profilePhoto);

    const username = document.createElement("figcaption");
    // Add the fetched user's name to this area. For now let's use name
    const name = "leticia namika";
    username.className = "capitalize text-white max-w-48 text-center";
    username.textContent = name;

    profile.appendChild(username);

    sideBar.appendChild(navBrand);
    sideBar.appendChild(profile);

    const sideNav = document.createElement("nav");
    sideNav.className = "flex flex-col w-fit h-full justify-between py-8";

    // Get the role
    const role = await this.getUserRole();
    const roleNavMenuItems = this.getMenuItems(role);

    const roleNavSection = document.createElement("section");
    roleNavSection.className = "flex flex-col gap-y-2";
    const roleNavLinks = roleNavMenuItems.map(this.generateNavLink);

    roleNavSection.append(...roleNavLinks);

    const sharedMenuItems = this.getMenuItems("shared");
    const sharedNavSection = document.createElement("section");
    sharedNavSection.className = "flex flex-col gap-y-2";

    const sharedNavLinks = sharedMenuItems.map(this.generateNavLink);

    const logoutButton = document.createElement("button");
    logoutButton.className = `w-full flex items-center gap-x-4 ${
      this.signingOut ? "text-popup-600" : "text-grey-100"
    } hover:text-popup-600 hover:bg-popup-100 px-3 py-1 rounded-lg`;
    logoutButton.addEventListener("click", async (event) => {
      event.preventDefault();
      this.isSigningOut = true;
      await supabaseClient.auth.signOut();
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (!session) navigateTo("/login");
    });

    logoutButton.innerHTML = `
      <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"></path>
      </svg>
    `;

    const textSpan = document.createElement("span");
    textSpan.className = "capitalize";
    textSpan.textContent = "Logout";

    logoutButton.appendChild(textSpan);

    sharedNavSection.append(...sharedNavLinks, logoutButton);

    sideNav.appendChild(roleNavSection);
    sideNav.appendChild(sharedNavSection);

    sideBar.appendChild(sideNav);

    const viewArea = document.createElement("main");
    viewArea.className = "flex h-full w-full border border-danger-500";
    viewArea.id = "content-area";

    contentContainer.appendChild(sideBar);
    contentContainer.appendChild(navBar);
    contentContainer.appendChild(viewArea);

    return contentContainer;
  }
}
