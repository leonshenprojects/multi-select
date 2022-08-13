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
    <div className={styles.checkbox}>
      <input
        id={id}
        className="visaullyHidden"
        type="checkbox"
        name={label}
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Checkbox;
