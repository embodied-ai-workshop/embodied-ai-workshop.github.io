// import React, { useState, useEffect } from "react";
import * as React from "react";

import { navigate } from "gatsby";

const IndexPage = () => {
  // Hardwire the year redirector until the new year goes live.
  // const currentYear = new Date().getFullYear();
  // const redirectYear = process.env.GATSBY_REDIRECT_YEAR || currentYear; // Default to the current year
  const redirectYear = "2024";
  const targetPage = `/cvpr${redirectYear}/`;
  
  React.useEffect(() => {
    navigate(targetPage);
  }, [targetPage]);
  
  return <p>Redirecting to CVPR {redirectYear} ...</p>
};

export default IndexPage;
