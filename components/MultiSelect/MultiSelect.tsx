import React, { FunctionComponent, InputHTMLAttributes } from "react";
import { htmlDecode } from "../../lib/htmlDecode";
import Button from "../Button/Button";
import Checkbox from "../Checkbox/Checkbox";
import SearchBar from "../SearchBar/SearchBar";
import useMultipleSelectOptions from "./hooks/useMultipleSelectOptions";
import styles from "./MultiSelect.module.scss";

export interface MultiSelectOption {
  id: string;
  label: string;
  value: InputHTMLAttributes<HTMLInputElement>["value"];
}

interface MultiSelectProps {
  title: string;
  options: Array<MultiSelectOption>;
  loading?: boolean;
  isErrored?: boolean;
}

const MultiSelect: FunctionComponent<MultiSelectProps> = ({
  title,
  options,
  loading,
  isErrored,
}) => {
  const {
    selectedOptions,
    unselectedOptions,
    handleFilterText,
    handleCheckboxToggle,
  } = useMultipleSelectOptions(options, title);

  return (
    <form
      className={styles.multiSelect}
      onSubmit={(event) => event.preventDefault()}
    >
      <fieldset>
        <legend>
          <h3 className={styles.multiSelect__title}>{title}</h3>
        </legend>

        <SearchBar
          hiddenLabel="Filter options on input"
          placeholder="Zoek op ..."
          onChange={handleFilterText}
        />

        <div className={styles.multiSelect__options}>
          {isErrored ? (
            <p>Failed to get options.</p>
          ) : loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {selectedOptions.map((option) => {
                const id = `selected option - ${option.id}`;

                return (
                  <Checkbox
                    key={id}
                    id={id}
                    label={htmlDecode(option.label) || ""}
                    value={option.value}
                    checked={true}
                    onChange={(event) => handleCheckboxToggle(event, option)}
                  />
                );
              })}

              {unselectedOptions.map((option) => {
                const id = `filtered option - ${option.id}`;

                return (
                  <Checkbox
                    key={id}
                    id={id}
                    label={htmlDecode(option.label) || ""}
                    value={option.value}
                    onChange={(event) => handleCheckboxToggle(event, option)}
                  />
                );
              })}
            </>
          )}
        </div>
      </fieldset>

      <Button label="Toepassen" type="submit" />
    </form>
  );
};

export default MultiSelect;
