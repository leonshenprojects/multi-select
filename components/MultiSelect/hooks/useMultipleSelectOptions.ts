import { debounce, isEmpty } from "lodash";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { MultiSelectOption } from "../MultiSelect";

interface Option extends MultiSelectOption {
  selected: boolean;
}

type OptionsByIds = {
  [id: string]: Option;
};

const useMultipleSelectOptions = (
  options: Array<MultiSelectOption>,
  title: string
): {
  selectedOptions: Array<Option>;
  unselectedOptions: Array<Option>;
  onFilterText(event: ChangeEvent<HTMLInputElement>): void;
  onCheckboxToggle(
    event: React.ChangeEvent<HTMLInputElement>,
    option: MultiSelectOption
  ): void;
} => {
  const [filterText, setFilterText] = useState("");
  const [optionsByIds, setOptionsByIds] = useState<OptionsByIds>({});
  const cacheKey = `multiSelectCache - ${title}`;

  const handleFilterText = debounce(
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

  // handle caching selected options
  useEffect(() => {
    const selectedOptionIds = Object.values(optionsByIds)
      .filter((option) => option.selected)
      .map((option) => option.id);

    if (isEmpty(optionsByIds)) return;

    localStorage.setItem(cacheKey, JSON.stringify(selectedOptionIds));
  }, [optionsByIds, cacheKey]);

  // handle creating optionsByIds
  useEffect(() => {
    let cachedSelectedOptionIds: Array<string> = [];
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
      cachedSelectedOptionIds = JSON.parse(cache);
    }

    setOptionsByIds(
      options.reduce((optionsByIds, option) => {
        return {
          ...optionsByIds,
          [option.id]: {
            ...option,
            selected: cachedSelectedOptionIds.includes(option.id),
          },
        };
      }, {} as OptionsByIds)
    );
  }, [options, cacheKey]);

  return {
    selectedOptions: sortedSelectedOptions,
    unselectedOptions: filteredOptions,
    onFilterText: handleFilterText,
    onCheckboxToggle: handleCheckboxToggle,
  };
};

export default useMultipleSelectOptions;
