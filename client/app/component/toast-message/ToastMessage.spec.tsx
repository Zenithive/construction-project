import { render } from '@testing-library/react';

import ToastMessage from './ToastMessage';

describe('ToastMessage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ToastMessage openFlag={false} severity="error"/>);
    expect(baseElement).toBeTruthy();
  });
});
