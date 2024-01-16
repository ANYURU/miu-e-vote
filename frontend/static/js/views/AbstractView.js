import { navigateTo, supabaseClient } from "../index.js";
export default class {
  constructor(params) {
    this.params = params;
    this.signingOut = false;
    this.role = null;
    this.profile = null;
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
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path fill="currentColor" d="m80.161 60.441l-15.66-7.47l-6.622-3.159c2.892-1.822 5.241-4.634 6.778-8.021a21.743 21.743 0 0 0 1.945-8.99c0-1.827-.29-3.562-.694-5.236c-1.97-8.112-8.305-14.088-15.91-14.088c-7.461 0-13.7 5.763-15.792 13.644c-.483 1.808-.815 3.688-.815 5.68c0 3.459.808 6.684 2.181 9.489c1.587 3.254 3.94 5.937 6.804 7.662l-6.342 2.953l-16.168 7.53c-1.404.658-2.327 2.242-2.327 4.011v17.765c0 2.381 1.659 4.311 3.707 4.311h24.013V72.92a.78.78 0 0 1 .119-.396l-.01-.006l3.933-6.812l.01.006c.14-.24.389-.41.687-.41c.298 0 .547.169.687.41l.004-.003l.036.063c.005.01.012.018.016.028l3.881 6.721l-.005.003a.783.783 0 0 1 .119.397v13.602h24.013c2.048 0 3.708-1.93 3.708-4.311V64.446c.003-1.763-.905-3.332-2.296-4.005zM54.62 55.886l.01.006l-3.934 6.812l-.01-.006a.796.796 0 0 1-.687.409a.796.796 0 0 1-.687-.409l-.005.003l-.04-.069c-.003-.007-.009-.013-.012-.02l-3.881-6.723l.004-.003a.783.783 0 0 1-.119-.397c0-.445.361-.806.806-.806h7.866c.445 0 .806.361.806.806a.762.762 0 0 1-.117.397z"></path>
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

  setRole(role) {
    this.role = role;
  }

  setTitle(title) {
    document.title = title;
  }

  getMenuItems(role) {
    return this.menuItems[role] || this.menuItems["student"];
  }

  setProfile(profile) {
    this.profile = profile;
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
    navLink.addEventListener("click", (event) => {
      event.preventDefault();
      navigateTo(path);
    });
    return navLink;
  }

  generateCloseIcon(size = 4, color = "currentColor") {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "h-" + size + " w-" + size);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("data-name", "Layer 2");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "m13.41 12 4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
    );
    path.setAttribute("data-name", "close");

    path.style.fill = color;

    g.appendChild(path);
    svg.appendChild(g);

    return svg;
  }
  renderLoader() {
    const loader = document.createElement("div");
    loader.setAttribute("role", "status");
    loader.className = "h-fit w-fit";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute(
      "class",
      "w-8 h-8 text-grey-100 animate-spin dark:text-gray-600 fill-success-400"
    );
    svg.setAttribute("viewBox", "0 0 100 101");
    svg.setAttribute("fill", "none");

    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1.setAttribute(
      "d",
      "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
    );
    path1.setAttribute("fill", "currentColor");

    // Create the second path inside the SVG
    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path2.setAttribute(
      "d",
      "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
    );
    path2.setAttribute("fill", "currentFill");

    // Append the paths to the SVG
    svg.appendChild(path1);
    svg.appendChild(path2);

    // Create the span element
    const span = document.createElement("span");
    span.classList.add("sr-only", "text-xs");
    span.textContent = "Loading...";

    loader.appendChild(svg);
    loader.appendChild(span);

    return loader;
  }

  getInitials(username) {
    if (username) {
      const initials = username.split(" ").map((name) => name[0]);
      return initials?.length > 1 ? initials[0] + initials[1] : initials[0];
    }

    return null;
  }

  createDeleteIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("id", "Layer_1");
    svg.setAttribute("x", "0");
    svg.setAttribute("y", "0");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 29 29");
    svg.setAttribute("xml:space", "preserve");
    svg.setAttribute(
      "class",
      "w-4 h-4 fill-black-300 group-hover:fill-danger-600"
    );

    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1.setAttribute("d", "M10 3v3h9V3a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1");
    path1.setAttribute("class", "svgShape");

    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path2.setAttribute(
      "d",
      "M4 5v1h21V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1zM6 8l1.812 17.209A2 2 0 0 0 9.801 27H19.2a2 2 0 0 0 1.989-1.791L23 8H6z"
    );
    path2.setAttribute("class", "svgShape");

    const path3 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path3.setAttribute(
      "d",
      "M10.577 24.997a.999.999 0 0 1-1.074-.92l-1-13a1 1 0 0 1 .92-1.074.989.989 0 0 1 1.074.92l1 13a1 1 0 0 1-.92 1.074z"
    );
    path3.setAttribute("class", "svgShape");

    const path4 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path4.setAttribute("d", "M15.5 24a1 1 0 0 1-2 0V11a1 1 0 0 1 2 0v13z");
    path4.setAttribute("class", "svgShape");

    const path5 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path5.setAttribute(
      "d",
      "M18.497 24.077a.999.999 0 1 1-1.994-.154l1-13a.985.985 0 0 1 1.074-.92 1 1 0 0 1 .92 1.074l-1 13z"
    );
    path5.setAttribute("class", "svgShape");

    svg.appendChild(path1);
    svg.appendChild(path2);
    svg.appendChild(path3);
    svg.appendChild(path4);
    svg.appendChild(path5);

    return svg;
  }

  createEditIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute(
      "class",
      "h-4 w-4 fill-black-300 group-hover:fill-black-600"
    );
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("id", "edit");

    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1.setAttribute("fill", "none");
    path1.setAttribute("d", "M0 0h24v24H0V0z");

    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path2.setAttribute(
      "d",
      "M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
    );

    svg.appendChild(path1);
    svg.appendChild(path2);

    return svg;
  }

  renderPageLoader() {
    const loader = this.renderLoader();
    const pageLoader = document.createElement("div");
    pageLoader.className =
      "flex h-screen w-screen justify-center items-center bg-grey-400";
    pageLoader.appendChild(loader);
    return pageLoader;
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
      "flex md:hidden px-5 justify-between items-center w-full min-h-fit bg-success-500";

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
      "h-24 w-24 bg-grey-100 rounded-full object-contain";
    profilePhoto.src = "/static/assets/images/profile.png";
    profilePhoto.alt = "MIU Logo";

    const profilePhotoSkeleton = document.createElement("div");
    profilePhotoSkeleton.className =
      "h-24 w-24 flex justify-center items-center bg-grey-100 rounded-full";

    const profilePhotoSkeletonContent = document.createElement("span");
    profilePhotoSkeletonContent.className = "text-xl font-light";
    profilePhotoSkeletonContent.textContent = this.profile?.user_name
      ? this.getInitials(this.profile.user_name)
      : "Profile";
    profilePhotoSkeleton.appendChild(profilePhotoSkeletonContent);

    this.profile?.avatar_url
      ? profile.appendChild(profilePhoto)
      : profile.appendChild(profilePhotoSkeleton);

    const username = document.createElement("figcaption");
    username.className = "capitalize text-white max-w-48 text-center";
    username.textContent = this.profile.user_name;

    profile.appendChild(username);

    sideBar.appendChild(navBrand);
    sideBar.appendChild(profile);

    const sideNav = document.createElement("nav");
    sideNav.className = "flex flex-col w-fit h-full justify-between py-8";

    // Get the role
    const role = await this.role;
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
      if (!session) {
        sessionStorage.removeItem("user_role");
        navigateTo("/login");
      }
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
    viewArea.className = "flex flex-col h-full w-full p-5 md:p-10";
    viewArea.id = "content-area";

    contentContainer.appendChild(sideBar);
    contentContainer.appendChild(navBar);
    contentContainer.appendChild(viewArea);

    return contentContainer;
  }
}
