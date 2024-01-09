import styles from './EarningCard.module.scss';

/* eslint-disable-next-line */
export interface EarningCardProps {
  isLoading: boolean;
}

export function EarningCard(props: EarningCardProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to EarningCard!</h1>
    </div>
  );
}

export default EarningCard;
