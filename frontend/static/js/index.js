import Dashboard from "./views/Dashboard.js";
import NotFoundView from "./views/NotFoundView.js";
import LoginView from "./views/LoginView.js";
import SignUpView from "./views/SignUpView.js";
import SetPasswordView from "./views/SetPasswordView.js";
import Candidates from "./views/CandidatesView.js";
import VerifyOtpView from "./views/VerifyOtpView.js";
import createSupabaseClient from "./supabase/supabase.js";

const supabaseClient = createSupabaseClient(
  config.supabaseUrl,
  config.supabaseKey
);

// const supabaseClient = supabase.createClient(config.supabaseUrl, config.supabaseKey);
const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const checkAuth = async () => {
  const response = await supabaseClient.auth.getSession();
  return response;
};

const router = async (supabaseClient) => {
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
      path: "/dashboard",
      view: Dashboard,
      requiresAuth: true,
    },
    {
      path: "/candidates",
      view: () => console.log("Viewing Settings"),
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

  if (!match) {
    match = {
      route: routes[routes.length - 1],
      isMatch: true,
    };
  }

  console.log(match);

  const view = new match.route.view(supabaseClient);

  // console.log(view.getHtml());
  function removeAllChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  const content = await view.renderContent();
  console.log("Content: ", content);
  const root = document.querySelector("#app");
  removeAllChildren(root);
  root.appendChild(content);

  // document.querySelector('#content').innerHTML = await view.renderContent();
  // const content = await view.renderContent();
  // const document.querySelect

  const auth = await checkAuth();
  console.log("Auth: ", auth);
};

window.addEventListener("popstate", router());

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router(supabaseClient);
});

export { navigateTo, supabaseClient };
