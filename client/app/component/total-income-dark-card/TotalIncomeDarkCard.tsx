import styles from './TotalIncomeDarkCard.module.scss';

/* eslint-disable-next-line */
export interface TotalIncomeDarkCardProps {
  isLoading: boolean;
}

export function TotalIncomeDarkCard(props: TotalIncomeDarkCardProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TotalIncomeDarkCard!</h1>
    </div>
  );
}

export default TotalIncomeDarkCard;
