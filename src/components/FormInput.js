import React from 'react'

const FormInput = ({placeholder, type, id, name}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      autoComplete={type}
      required
      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:border-input-border"
      placeholder={placeholder}
    />
  );
}

export default FormInput