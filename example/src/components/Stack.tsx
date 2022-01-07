import React, { Fragment } from 'react';
import { ViewStyle } from 'react-native';
import { Spacer } from './Spacer';

import { styled, Theme } from '../styles';
import { flattenChildren } from './utils';

type Props = {
  space: keyof Theme['space'];
  axis?: 'x' | 'y';
  align?: 'center' | 'start' | 'end' | 'stretch';
  justify?: 'center' | 'start' | 'end' | 'between' | 'around';
  style?: ViewStyle;
  debug?: boolean;
  children: React.ReactNode;
};

export function Stack({
  children,
  axis,
  space,
  align,
  justify,
  debug,
  ...rest
}: Props) {
  // Handle `React.Fragments` by flattening children
  const elements = flattenChildren(children).filter((e) =>
    React.isValidElement(e)
  );

  const lastIndex = React.Children.count(elements) - 1;

  return (
    <StyledStack axis={axis} align={align} justify={justify} {...rest}>
      {elements.map((child, index) => {
        if (!React.isValidElement(child)) return null;

        const isSpacer = (child as any).type['__SPACER__'];

        // Just return spacers as is so that they can override the default spacing
        if (isSpacer) return React.cloneElement(child);

        const isLast = index === lastIndex;
        const nextElement = isLast ? null : (elements[index + 1] as any);
        const isNextSpacer = nextElement && nextElement.type['__SPACER__'];
        const shouldAddSpacing = !isLast && !isNextSpacer;

        return (
          <Fragment key={index}>
            {React.cloneElement(child)}
            {shouldAddSpacing && (
              <Spacer axis={axis} size={space} debug={debug} />
            )}
          </Fragment>
        );
      })}
    </StyledStack>
  );
}

const StyledStack = styled('View', {
  variants: {
    axis: {
      x: { flexDirection: 'row' },
      y: { flexDirection: 'column' },
    },
    align: {
      center: { alignItems: 'center' },
      start: { alignItems: 'flex-start' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
    justify: {
      center: { justifyContent: 'center' },
      start: { justifyContent: 'flex-start' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
    },
  },
});
