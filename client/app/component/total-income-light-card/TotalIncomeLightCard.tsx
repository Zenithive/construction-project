import styles from './TotalIncomeLightCard.module.scss';

/* eslint-disable-next-line */
export interface TotalIncomeLightCardProps {
  isLoading: boolean;
}

export function TotalIncomeLightCard(props: TotalIncomeLightCardProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TotalIncomeLightCard!</h1>
    </div>
  );
}

export default TotalIncomeLightCard;
