import { render } from '@testing-library/react';

import TotalOrderLineCard from './TotalOrderLineCard';

describe('TotalOrderLineCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TotalOrderLineCard />);
    expect(baseElement).toBeTruthy();
  });
});
