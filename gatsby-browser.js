import "./src/styles/global.scss";

export const onRouteUpdate = ({ location }) => {
  if (location.pathname === "/") {
    // Hardwire the year redirector until the new year goes live.
    // const currentYear = new Date().getFullYear();
    // const redirectYear = process.env.GATSBY_REDIRECT_YEAR || currentYear; // Default to the current year
    const redirectYear = "2026";
    const targetPage = `/cvpr${redirectYear}/`;

    if (location.pathname !== targetPage) {
      window.location.replace(targetPage);
    }
  }
};