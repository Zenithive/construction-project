import { render } from '@testing-library/react';

import TotalIncomeLightCard from './TotalIncomeLightCard';

describe('TotalIncomeLightCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TotalIncomeLightCard />);
    expect(baseElement).toBeTruthy();
  });
});
