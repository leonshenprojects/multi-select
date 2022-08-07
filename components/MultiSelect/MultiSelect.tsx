import { debounce } from "lodash";
import React, {
  FunctionComponent,
  InputHTMLAttributes,
  useMemo,
  useState,
} from "react";
import styles from "./MultiSelect.module.scss";

export interface MultiSelectOption {
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
  const [selectedOptions, setSelectedOption] = useState(new Set());
  const [filterText, setFilterText] = useState("");

  const handleFilterInput = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterText(event.target.value);
    },
    300
  );

  const filteredOptions = useMemo(() => {
    if (!filterText)
      return options.filter((option) => !selectedOptions.has(option));

    return options.filter(
      (option) =>
        option.label.toLocaleLowerCase().match(filterText.toLowerCase()) &&
        !selectedOptions.has(option)
    );
  }, [options, filterText, selectedOptions]);

  const sortedSelectedOptions = useMemo(() => {
    return (Array.from(selectedOptions) as Array<MultiSelectOption>).sort(
      (a, b) => {
        return a.label.localeCompare(b.label);
      }
    );
  }, [selectedOptions]);

  const handleCheckboxToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    option: MultiSelectOption
  ) => {
    if (event.target.checked) {
      selectedOptions.add(option);
      setSelectedOption(new Set(selectedOptions));
      return;
    }

    selectedOptions.delete(option);
    setSelectedOption(new Set(selectedOptions));
  };

  const noAvailablesOptions =
    filteredOptions.length === 0 && selectedOptions.size === 0;

  return (
    <div className={styles.multiselect}>
      <h3>{title}</h3>

      <input
        type="text"
        onChange={handleFilterInput}
        placeholder="Zoek op ..."
      />

      <div className={styles.multiselect__options}>
        {loading ? (
          <p>Loading...</p>
        ) : isErrored ? (
          <p>Failed to get product groups</p>
        ) : noAvailablesOptions ? (
          <p>No product groups found.</p>
        ) : (
          <>
            {sortedSelectedOptions.map((option) => {
              const id = `selected option - ${option.label}`;

              return (
                <div key={id}>
                  <input
                    type="checkbox"
                    id={id}
                    name={option.label}
                    value={option.value}
                    onChange={(event) => handleCheckboxToggle(event, option)}
                    checked
                  />
                  <label htmlFor={id}>{option.label}</label>
                </div>
              );
            })}

            {filteredOptions.map((option) => {
              const id = `filtered option - ${option.label}`;

              return (
                <div key={id}>
                  <input
                    type="checkbox"
                    id={id}
                    name={option.label}
                    value={option.value}
                    onChange={(event) => handleCheckboxToggle(event, option)}
                  />
                  <label htmlFor={id}>{option.label}</label>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
