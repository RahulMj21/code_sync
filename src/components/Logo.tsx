import React from "react";

const Logo = ({ small }: { small: Boolean }) => {
  return (
    <div className={`logo ${small ? "small" : ""}`}>
      <div className="icon">
        <img src="/images/dna.svg" alt="logo" />
      </div>
      <div className="seperator" />
      <div className="info">
        <h2>Code Sync</h2>
        <p>Realtime collaboration</p>
      </div>
    </div>
  );
};

export default Logo;
