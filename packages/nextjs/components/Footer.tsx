import React from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";






/**
 * Site footer
 */
export const Footer = () => {
  

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            
            
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">
                Copyright 2025 Optilex, LLC
              </p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://gingerscience.org/"
                target="_blank"
                rel="noreferrer"
              >
                
                <span className="link">Ginger Science</span>
              </a>
            </div>
           
            <div className="text-center">
              <a href="https://t.me/gingersience" target="_blank" rel="noreferrer" className="link">
                Telegram
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
