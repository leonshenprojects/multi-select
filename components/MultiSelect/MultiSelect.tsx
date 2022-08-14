import { debounce } from "lodash";
import React, {
  FunctionComponent,
  InputHTMLAttributes,
  useMemo,
  useState,
} from "react";
import { htmlDecode } from "../../lib/htmlDecode";
import Button from "../Button/Button";
import Checkbox from "../Checkbox/Checkbox";
import SearchBar from "../SearchBar/SearchBar";
import useOptionsByIds from "./hooks/useOptionsByIds";
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
  const [optionsByIds, setOptionsByIds] = useOptionsByIds(options, title);
  const [filterText, setFilterText] = useState("");

  const handleFilterInput = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterText(event.target.value);
    },
    300
  );

  const filteredOptions = useMemo(() => {
    const unselectedOptions = Object.values(optionsByIds).filter(
      (option) => !option.selected
    );

    if (!filterText) return unselectedOptions;

    return unselectedOptions.filter((option) =>
      option.label.toLocaleLowerCase().match(filterText.toLowerCase())
    );
  }, [optionsByIds, filterText]);

  const sortedSelectedOptions = useMemo(() => {
    const selectedOptions = Object.values(optionsByIds).filter(
      (option) => option.selected
    );

    return selectedOptions.sort((a, b) => {
      return a.label.localeCompare(b.label);
    });
  }, [optionsByIds]);

  const handleCheckboxToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    option: MultiSelectOption
  ) => {
    setOptionsByIds((prev) => ({
      ...prev,
      [option.id]: {
        ...prev[option.id],
        selected: !!event.target.checked,
      },
    }));
  };

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
          onChange={handleFilterInput}
        />

        <div className={styles.multiSelect__options}>
          {isErrored ? (
            <p>Failed to get options.</p>
          ) : loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {sortedSelectedOptions.map((option) => {
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

              {filteredOptions.map((option) => {
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
