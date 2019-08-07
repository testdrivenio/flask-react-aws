import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import About from '../About';

afterEach(cleanup);

it('renders properly', () => {
  const { getByText } = render(<About />);
  expect(getByText('Add something relevant here.')).toHaveClass('content');
});

it("renders", () => {
  const { asFragment } = render(<About />);
  expect(asFragment()).toMatchSnapshot();
});
