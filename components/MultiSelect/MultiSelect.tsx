import { debounce } from "lodash";
import React, {
  FunctionComponent,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";
import { htmlDecode } from "../../lib/htmlDecode";
import Checkbox from "../Checkbox/Checkbox";
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
  const [selectedOptions, setSelectedOptions] =
    useState<Array<MultiSelectOption>>();
  const [filterText, setFilterText] = useState("");
  const cacheKey = `multiSelectCache - ${title}`;

  const handleFilterInput = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterText(event.target.value);
    },
    300
  );

  const filteredOptions = useMemo(() => {
    const unselectedOptions = options.filter(
      (option) =>
        !selectedOptions?.find(
          (selectedOption) => selectedOption.label === option.label
        )
    );

    if (!filterText) return unselectedOptions;

    return unselectedOptions.filter((option) =>
      option.label.toLocaleLowerCase().match(filterText.toLowerCase())
    );
  }, [options, filterText, selectedOptions]);

  const sortedSelectedOptions = useMemo(() => {
    return selectedOptions?.sort((a, b) => {
      return a.label.localeCompare(b.label);
    });
  }, [selectedOptions]);

  const handleCheckboxToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    option: MultiSelectOption
  ) => {
    setSelectedOptions((prev) => {
      if (event.target.checked) {
        return [...(prev || []), option];
      }

      return prev?.filter(
        (selectedOption) => selectedOption.label !== option.label
      );
    });
  };

  const noAvailablesOptions =
    filteredOptions.length === 0 &&
    (!selectedOptions || selectedOptions.length === 0);

  useEffect(() => {
    if (!selectedOptions) {
      localStorage.removeItem(cacheKey);
      return;
    }

    localStorage.setItem(cacheKey, JSON.stringify(selectedOptions));
  }, [selectedOptions]);

  useEffect(() => {
    const cachedSelectedOptions = localStorage.getItem(cacheKey);
    if (!cachedSelectedOptions) return;
    setSelectedOptions(JSON.parse(cachedSelectedOptions));
  }, []);

  return (
    <form>
      <fieldset className={styles.multiselect}>
        <legend>{title}</legend>

        <fieldset>
          <legend className="visaullyHidden">Filter product categories</legend>
          <input
            type="search"
            onChange={handleFilterInput}
            placeholder="Zoek op ..."
          />
        </fieldset>

        <div className={styles.multiselect__options}>
          {loading ? (
            <p>Loading...</p>
          ) : isErrored ? (
            <p>Failed to get options</p>
          ) : noAvailablesOptions ? (
            <p>No options found.</p>
          ) : (
            <>
              {sortedSelectedOptions?.map((option) => {
                const id = `selected option - ${option.label}`;

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
                const id = `filtered option - ${option.label}`;

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

      <button type="submit">Toepassen</button>
    </form>
  );
};

export default MultiSelect;
