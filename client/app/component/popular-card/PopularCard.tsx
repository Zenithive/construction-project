import styles from './PopularCard.module.scss';

/* eslint-disable-next-line */
export interface PopularCardProps {
  isLoading: boolean;
}

export function PopularCard(props: PopularCardProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to PopularCard!</h1>
    </div>
  );
}

export default PopularCard;
