import React from "react";

const Input = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  label,
}) => {
  return (
    <div className="input-group">
      <label>{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;