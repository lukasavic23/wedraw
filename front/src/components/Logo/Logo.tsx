import styles from "./Logo.module.css";

const Logo = () => {
  return (
    <p className={styles.logo}>
      <span>We</span>
      <span>Draw!</span>
    </p>
  );
};

export default Logo;
