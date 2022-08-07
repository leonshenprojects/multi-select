import { FunctionComponent, InputHTMLAttributes } from "react";
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
  return (
    <div className={styles.multiselect}>
      <h3>{title}</h3>

      <div className={styles.multiselect__options}>
        {loading ? (
          <p>Loading...</p>
        ) : isErrored ? (
          <p>Failed to get product groups</p>
        ) : (
          options.map((option, index) => {
            const id = `${index} - ${option.label}`;

            return (
              <div key={id}>
                <input
                  type="checkbox"
                  id={id}
                  name={option.label}
                  value={option.value}
                />
                <label htmlFor={id}>{option.label}</label>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
