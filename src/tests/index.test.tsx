import React from 'react';
import { render } from '@testing-library/react-native';
import { createStitches } from '../internals';

describe('Basic', () => {
  it('Functionality of styled()', () => {
    const { styled } = createStitches();

    const Comp = styled('View', {
      backgroundColor: 'red',
      height: 100,
      width: 100,
    });

    const { toJSON } = render(<Comp />);
    const result = toJSON();

    expect(result.type).toEqual('View');
    expect(result.props.style[0]).toMatchObject({
      backgroundColor: 'red',
      height: 100,
      width: 100,
    });
  });
});
