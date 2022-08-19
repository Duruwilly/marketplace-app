import React from 'react'
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { GrGithub } from "react-icons/gr";
import Logo from "../assets/logo-plain2-1.png";

const Footer = () => {
  return (
    <div className="bg-black py-8 text-center text-white mt-6">
      <div className="flex max-w-xs mx-auto items-center justify-between">
        <a href="#" rel="noreferer" target="_blank">
          <FaFacebookF />
        </a>
        <a href="#" rel="noreferer" target="_blank">
          <FaTwitter />
        </a>
        <a href="#" rel="noreferer" target="_blank">
          <FaLinkedinIn />
        </a>
        <a href="#" rel="noreferer" target="_blank">
          <GrGithub />
        </a>
      </div>
      <div className="flex max-w-xs mx-auto items-center gap-3 justify-center mt-5">
        <span>&copy; 2022</span>
        <Link to="/">
          <img src={Logo} alt="logo" className="h-6" />
        </Link>
      </div>
    </div>
  );
}

export default Footer