import styles from './TotalGrowthBarCard.module.scss';

/* eslint-disable-next-line */
export interface TotalGrowthBarCardProps {
  isLoading: boolean;
}

export function TotalGrowthBarCard(props: TotalGrowthBarCardProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TotalGrowthBarCard!</h1>
    </div>
  );
}

export default TotalGrowthBarCard;
