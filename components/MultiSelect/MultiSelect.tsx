import { debounce, isEmpty } from "lodash";
import React, {
  FunctionComponent,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";
import { htmlDecode } from "../../lib/htmlDecode";
import Button from "../Button/Button";
import Checkbox from "../Checkbox/Checkbox";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./MultiSelect.module.scss";

export interface MultiSelectOption {
  id: string;
  label: string;
  value: InputHTMLAttributes<HTMLInputElement>["value"];
}

interface Option extends MultiSelectOption {
  selected: boolean;
}

type OptionsByIds = {
  [id: string]: Option;
};

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
  const [optionsByIds, setOptionsByIds] = useState<OptionsByIds>({});
  const [filterText, setFilterText] = useState("");
  const cacheKey = `multiSelectCache - ${title}`;

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

  useEffect(() => {
    let cachedSelectedOptionIds: Array<string> = [];
    const cache = localStorage.getItem(cacheKey);

    if (cache) {
      cachedSelectedOptionIds = JSON.parse(cache);
    }

    const optionsByIds = options.reduce((optionsByIds, option) => {
      return {
        ...optionsByIds,
        [option.id]: {
          ...option,
          selected: cachedSelectedOptionIds.includes(option.id),
        },
      } as OptionsByIds;
    }, {} as OptionsByIds);

    setOptionsByIds(optionsByIds);
  }, [options]);

  useEffect(() => {
    const selectedOptionIds = Object.values(optionsByIds)
      .filter((option) => option.selected)
      .map((option) => option.id);

    if (isEmpty(optionsByIds)) return;

    localStorage.setItem(cacheKey, JSON.stringify(selectedOptionIds));
  }, [optionsByIds]);

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
          hiddenLabel="Filter product categories on input"
          placeholder="Zoek op ..."
          onChange={handleFilterInput}
        />

        <div className={styles.multiSelect__options}>
          {loading && <p>Loading...</p>}

          {isErrored && <p>Failed to get options.</p>}

          {sortedSelectedOptions.map((option) => {
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
        </div>
      </fieldset>

      <Button label="Toepassen" type="submit" />
    </form>
  );
};

export default MultiSelect;
