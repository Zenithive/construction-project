import { render } from '@testing-library/react';

import TotalGrowthBarCard from './TotalGrowthBarCard';

describe('TotalGrowthBarCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TotalGrowthBarCard />);
    expect(baseElement).toBeTruthy();
  });
});
