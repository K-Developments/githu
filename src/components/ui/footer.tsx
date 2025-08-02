"use client";

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-column">
          <a href="#" className="logo">ISLAND<span>HOPES</span></a>
          <p>
            Crafting unforgettable journeys to the world's most exquisite island destinations.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="Youtube"><Youtube size={20} /></a>
          </div>
        </div>
        <div className="footer-column">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Team</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><a href="#">Destinations</a></li>
            <li><a href="#">Experiences</a></li>
            <li><a href="#">Inspiration</a></li>
            <li><a href="#">Journal</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Island Hopes. All rights reserved.</p>
      </div>
    </footer>
  );
}
