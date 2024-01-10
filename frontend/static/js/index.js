import Elections from "./views/Elections.js";
import NotFoundView from "./views/NotFoundView.js";
import LoginView from "./views/LoginView.js";
import SignUpView from "./views/SignUpView.js";
import SetPasswordView from "./views/SetPasswordView.js";
import Apply from "./views/ApplyView.js";
import Notifications from "./views/NotificationsView.js";
import VerifyOtpView from "./views/VerifyOtpView.js";
import Results from "./views/ResultsView.js";
import Profile from "./views/ProfileView.js";
import createSupabaseClient from "./supabase/supabase.js";

const supabaseClient = createSupabaseClient(
  config.supabaseUrl,
  config.supabaseKey
);

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const checkAuth = async () => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  return session ?? null;
};

const router = async () => {
  const routes = [
    {
      path: "/",
      view: LoginView,
      requiresAuth: false,
    },
    {
      path: "/login",
      view: LoginView,
      requiresAuth: false,
    },
    {
      path: "/sign-up",
      view: SignUpView,
      requiresAuth: false,
    },
    {
      path: "/elections",
      view: Elections,
      requiresAuth: true,
    },
    {
      path: "/candidates",
      view: () => console.log("Viewing Settings"),
      requiresAuth: true,
    },
    {
      path: "/apply",
      view: Apply,
      requiresAuth: true,
    },
    {
      path: "/notifications",
      view: Notifications,
      requiresAuth: true,
    },
    {
      path: "/results",
      view: Results,
      requiresAuth: true,
    },
    {
      path: "/profile",
      view: Profile,
      requiresAuth: true,
    },
    {
      path: "/verify-otp",
      view: VerifyOtpView,
      requiresAuth: false,
    },
    {
      path: "/set-password",
      view: SetPasswordView,
      requiresAuth: true,
    },
    {
      path: "/404",
      view: NotFoundView,
    },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (match && match?.route?.requiresAuth && !(await checkAuth())) {
    navigateTo("/login");
    return;
  }

  if (match && !match.route?.requiresAuth && (await checkAuth())) {
    navigateTo("/elections");
    return;
  }

  if (!match) {
    match = {
      route: routes[routes.length - 1],
      isMatch: true,
    };
  }

  const view = new match.route.view();

  function removeAllChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  const content = await view.renderContent();
  const root = document.querySelector("#app");
  removeAllChildren(root);
  root.appendChild(content);
};

window.addEventListener("popstate", router());

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});

export { navigateTo, supabaseClient, checkAuth };
