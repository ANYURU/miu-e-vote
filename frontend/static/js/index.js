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
import CandidatesView from "./views/CandidatesView.js";
import UnauthorizedView from "./views/UnauthorizedView.js";
import SetElection from "./views/SetElection.js";
import createSupabaseClient from "./supabase/supabase.js";

const supabaseClient = createSupabaseClient(
  config.supabaseUrl,
  config.supabaseKey
);

let userRole = null;
let profile = null;

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session) {
    const {
      user: { id: user_id },
    } = session;

    fetchUserDetails(user_id);
  } else {
    userRole = null;
    router();
  }
});

async function fetchUserDetails(user_id) {
  userRole = await getUserRole(user_id);
  profile = await getUserProfile(user_id);
  router();
}

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

const checkAuth = async () => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  return session ?? null;
};

async function getUserRole(user_id) {
  const {
    data: [
      {
        roles: { role_name },
      },
    ],
  } = await supabaseClient
    .from("user_roles")
    .select(
      `
      roles (
        role_name
      )
    `
    )
    .eq("user_id", user_id);

  return role_name;
}

async function getUserProfile(user_id) {
  const { data: userProfile } = await supabaseClient
    .from("users")
    .select()
    .eq("user_id", user_id)
    .limit(1)
    .single();

  return userProfile;
}

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
      path: "/elections/set-election",
      view: SetElection,
      requiresAuth: true,
    },
    {
      path: "/candidates",
      view: CandidatesView,
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
      path: "/unauthorized",
      view: UnauthorizedView,
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
  view.setRole(userRole);
  view.setProfile(profile);

  const content = await view.renderContent();
  const root = document.querySelector("#app");
  removeAllChildren(root);
  root.appendChild(content);
};

window.addEventListener("popstate", router);

export { navigateTo, supabaseClient, checkAuth, removeAllChildren };
