import { render } from '@testing-library/react';

import PopularCard from './PopularCard';

describe('PopularCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PopularCard />);
    expect(baseElement).toBeTruthy();
  });
});
