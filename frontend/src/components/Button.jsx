import React from "react";

const Button = ({ text, loading, ...props }) => {
  return (
    <button {...props} disabled={loading}>
      {loading ? "Loading..." : text}
    </button>
  );
};

export default Button;