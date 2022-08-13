import { ChangeEvent, FunctionComponent } from "react";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  hiddenLabel: string;
  placeholder?: string;
  onChange(event: ChangeEvent<HTMLInputElement>): void;
}

const SearchBar: FunctionComponent<SearchBarProps> = ({
  hiddenLabel,
  placeholder,
  onChange,
}) => {
  return (
    <fieldset className={styles.searchBar}>
      <legend className="visuallyHidden">{hiddenLabel}</legend>
      <input
        className={styles.searchBar__input}
        type="search"
        onChange={onChange}
        placeholder={placeholder}
      />
      <img
        className={styles.searchBar__icon}
        src="/search.svg"
        alt="Search bar icon"
      />
    </fieldset>
  );
};

export default SearchBar;
