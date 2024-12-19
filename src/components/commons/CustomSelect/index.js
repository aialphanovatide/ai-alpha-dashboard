import React, { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import defaultImg from "src/assets/brand/logo.png";

const CustomSelect = ({
  items = [],
  onSelect,
  placeholder = "Select coin",
  element = "coins",
  value,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelectedItem(item);
    onSelect(item);
    setIsOpen(false);
  };

  const resetSelect = () => {
    setSelectedItem(null);
    onSelect(null);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.selectContainer} ${isOpen ? styles.open : ""}`}
    >
      <button
        className={styles.selectHeader}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className={styles.selectedItem}>
          {selectedItem?.icon && (
            <img
              src={selectedItem.icon}
              alt="itemImg"
              onError={(e) => (e.target.src = defaultImg)}
            />
          )}
          <span>
            {selectedItem?.label || selectedItem?.name || placeholder}
          </span>
        </div>
        <div className={styles.arrow} />
      </button>
      <div className={styles.dropdown}>
        <div className={styles.dropdownHeader} onClick={resetSelect}>
          All {element}
        </div>
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className={styles.option}
              onClick={() => handleSelect(item)}
            >
              {item.icon && (
                <img
                  src={item.icon}
                  alt="itemImg"
                  onError={(e) => (e.target.src = defaultImg)}
                />
              )}
              <span>{item.label || item.name}</span>
            </div>
          ))
        ) : (
          <div className={styles.option}>No items available</div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
