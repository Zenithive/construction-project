import { render } from '@testing-library/react';

import TotalIncomeDarkCard from './TotalIncomeDarkCard';

describe('TotalIncomeDarkCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TotalIncomeDarkCard />);
    expect(baseElement).toBeTruthy();
  });
});
