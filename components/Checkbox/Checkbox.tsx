import { ChangeEvent, FunctionComponent, InputHTMLAttributes } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  id: string;
  label: string;
  value: InputHTMLAttributes<HTMLInputElement>["value"];
  checked?: boolean;
  onChange?(event: ChangeEvent<HTMLInputElement>): void;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
  id,
  label,
  value,
  checked,
  onChange,
}) => {
  return (
    <div className={`${styles.checkbox}`} data-testid="checkbox">
      <input
        id={id}
        className={`visuallyHidden ${styles.checkbox__input}`}
        type="checkbox"
        name={label}
        value={value}
        onChange={onChange}
        checked={checked}
        data-testid={`checkbox - ${id}`}
      />
      <label className={styles.checkbox__label} htmlFor={id}>
        <span className={styles.checkbox__icon} />
        <span className={styles.checkbox__text}>{label}</span>
      </label>
    </div>
  );
};

export default Checkbox;
