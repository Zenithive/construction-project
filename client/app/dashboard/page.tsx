'use client'
import { Accounts } from '../component/accounts';

/* eslint-disable-next-line */
export interface DashboardProps {}

export default function Dashboard(props: DashboardProps) {


  return (
      <Accounts pageTitle="Users" />
  );
}
