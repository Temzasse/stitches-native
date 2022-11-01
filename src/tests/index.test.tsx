import React from 'react';
import { render } from '@testing-library/react-native';
import { createStitches as _createStitches } from '../internals';
import type { CreateStitches } from '../types';

// NOTE: the JSDoc types from the internal `createStitches` are not working properly
const createStitches = _createStitches as CreateStitches;

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

    expect(result?.type).toEqual('View');
    expect(result?.props.style[0]).toMatchObject({
      backgroundColor: 'red',
      height: 100,
      width: 100,
    });
  });
});
