import Image from "next/image";
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
    <fieldset className={styles.searchBar} data-testid="search bar">
      <legend className="visuallyHidden">{hiddenLabel}</legend>
      <input
        className={styles.searchBar__input}
        type="search"
        onChange={onChange}
        placeholder={placeholder}
      />
      <Image src="/search.svg" alt="Search bar icon" height={16} width={16} />
    </fieldset>
  );
};

export default SearchBar;
