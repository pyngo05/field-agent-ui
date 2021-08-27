import PropTypes from "prop-types";
import React from "react";

function Input({ changeHandler, value, label, name }) {
  return (
    <div>
      <label htmlFor={name}>{label}: </label>
      <input
        id={name}
        type="text"
        onChange={changeHandler}
        value={value}
        name={name}
      />
    </div>
  );
}

Input.propTypes = {
  changeHandler: PropTypes.func.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
};

export default Input;
