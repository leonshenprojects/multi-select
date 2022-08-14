import { ButtonHTMLAttributes, FunctionComponent, MouseEvent } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  label: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?(event: MouseEvent<HTMLButtonElement>): void;
}

const Button: FunctionComponent<ButtonProps> = ({
  label,
  type = "button",
  onClick,
}) => {
  return (
    <button className={styles.button} type={type} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
