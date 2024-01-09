import styles from './TotalOrderLineCard.module.scss';

/* eslint-disable-next-line */
export interface TotalOrderLineCardProps {
  isLoading: boolean;
}

export function TotalOrderLineCard(props: TotalOrderLineCardProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TotalOrderLineCard!</h1>
    </div>
  );
}

export default TotalOrderLineCard;
