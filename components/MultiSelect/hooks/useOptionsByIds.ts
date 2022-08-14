import { isEmpty } from "lodash";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MultiSelectOption } from "../MultiSelect";

interface Option extends MultiSelectOption {
  selected: boolean;
}

type OptionsByIds = {
  [id: string]: Option;
};

const useOptionsByIds = (
  options: Array<MultiSelectOption>,
  title: string
): [OptionsByIds, Dispatch<SetStateAction<OptionsByIds>>] => {
  const [optionsByIds, setOptionsByIds] = useState<OptionsByIds>({});
  const cacheKey = `multiSelectCache - ${title}`;

  useEffect(() => {
    const selectedOptionIds = Object.values(optionsByIds)
      .filter((option) => option.selected)
      .map((option) => option.id);

    if (isEmpty(optionsByIds)) return;

    localStorage.setItem(cacheKey, JSON.stringify(selectedOptionIds));
  }, [optionsByIds]);

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

  return [optionsByIds, setOptionsByIds];
};

export default useOptionsByIds;
