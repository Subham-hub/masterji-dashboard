import React from "react";
import Link from "next/link";
import { Copyright } from "lucide-react";

const Footer = () => {
  return (
    <footer className="dark:bg-slate-900 text-gray-900 dark:text-gray-100 shadow-md border py-4 mt-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <p className="flex items-center">
              <Copyright className="w-4 h-4" /> {new Date().getFullYear()}{" "}
              MasterJi. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-gray-400">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-gray-400">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
