import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CountrySelect.scss";
import { COUNTRIES } from "../../data/countries";

const CountrySelect = ({
  value,
  onChange,
  name,
  id,
  placeholder = "Select a country",
  label,
  required = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter countries based on search term
  const filteredCountries = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find selected country
  const selectedCountry = COUNTRIES.find((c) => c.name === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
          handleSelect(filteredCountries[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        break;
      default:
        break;
    }
  };

  const handleSelect = (country) => {
    // Create a synthetic event for compatibility with existing onChange handlers
    const syntheticEvent = {
      target: {
        name: name,
        value: country.name,
      },
    };
    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className={`country-select ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="country-select-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      <div
        className={`country-select-input ${isOpen ? "open" : ""} ${
          selectedCountry ? "has-value" : ""
        }`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
      >
        {selectedCountry ? (
          <div className="selected-country">
            <img
              src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png 2x`}
              alt={`${selectedCountry.name} flag`}
              className="country-flag"
              loading="lazy"
            />
            <span className="country-name">{selectedCountry.name}</span>
          </div>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <svg
          className={`dropdown-icon ${isOpen ? "rotate" : ""}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="country-dropdown"
            id={`${id}-listbox`}
            role="listbox"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="search-wrapper">
              <svg
                className="search-icon"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.75 15.75L12.4875 12.4875"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="countries-list">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <motion.div
                    key={country.code}
                    className={`country-item ${
                      highlightedIndex === index ? "highlighted" : ""
                    } ${
                      selectedCountry?.code === country.code ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(country)}
                    role="option"
                    aria-selected={selectedCountry?.code === country.code}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                  >
                    <img
                      src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
                      alt={`${country.name} flag`}
                      className="country-flag"
                      loading="lazy"
                    />
                    <span className="country-name">{country.name}</span>
                    {selectedCountry?.code === country.code && (
                      <svg
                        className="check-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 4.5L6.75 12.75L3 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="no-results">
                  <p>No countries found</p>
                  <span>Try a different search term</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountrySelect;
