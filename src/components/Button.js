import React from 'react'

const Button = ({text}) => {
  return (
    <button
      type="submit"
      className="group relative w-full flex justify-center py-2 px-4 text-lg font-medium rounded-md text-white bg-primaryBackground focus:outline-none"
    >
      {text}
    </button>
  );
}

export default Button