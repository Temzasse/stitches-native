import React from 'react';
import { Switch, View, ViewProps } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { styled, css } from './styled';

export default function Example({
  mode,
  toggleMode,
}: {
  mode: 'dark' | 'light';
  toggleMode: () => void;
}) {
  return (
    <>
      <Wrapper>
        <Switch value={mode === 'dark'} onValueChange={toggleMode} />

        <Button variant="primary">
          <ButtonText color="white">Hello</ButtonText>
        </Button>

        <Button variant="secondary" style={{ marginTop: 16 }}>
          <ButtonText>Hello</ButtonText>
        </Button>

        <Button
          variant="secondary"
          size="small"
          outlined
          style={{ marginTop: 16 }}
        >
          <ButtonText
            variant={{ '@phone': 'body', '@tablet': 'title' }}
            color={{ '@sm': 'primary', '@xl': 'secondary' }}
          >
            Hello
          </ButtonText>
        </Button>

        <Rect>
          <Box css={{ backgroundColor: '$secondary', size: 40 }} />
        </Rect>

        <Box2 />

        <FunctionBox />
      </Wrapper>

      <StatusBar style="auto" />
    </>
  );
}

const someStyles = css({
  flex: 1,
  backgroundColor: '$background',
});

const Wrapper = styled('View', {
  flexShrink: 0,
  justifyContent: 'center',
  alignItems: 'center',
  ...someStyles,
});

const Box = styled('View', {});

const Box2 = styled(Box, {
  backgroundColor: 'red',
  marginTop: '$3',
  size: 100,
  borderRadius: '$lg',
});

const FunctionBox = styled(
  ({ children, ...props }: ViewProps & { children: React.ReactNode }) => (
    <View {...props}>{children}</View>
  ),
  {
    backgroundColor: 'blue',
    marginTop: '$2',
    size: 100,
    borderRadius: '$sm'
  }
)

const Rect = styled('View', {
  backgroundColor: '$primary',
  size: 100,
  marginTop: '$3',
  borderRadius: '$sm',
  flexCenter: 'row',
});

const Button = styled('TouchableOpacity', {
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 999,
  minWidth: 100,
  backgroundColor: '$primary',

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
      },
      secondary: {
        backgroundColor: '$secondary',
      },
    },
    size: {
      small: {
        height: 32,
        paddingHorizontal: '$2',
      },
      large: {
        height: 44,
        paddingHorizontal: '$3',
      },
    },
    outlined: {
      true: {
        borderWidth: 1,
      },
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      outlined: true,
      css: {
        borderColor: '$primary',
        backgroundColor: 'transparent',
      },
    },
    {
      variant: 'secondary',
      outlined: true,
      css: {
        borderColor: '$secondary',
        backgroundColor: 'transparent',
      },
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'large',
  },
});

const ButtonText = styled('Text', {
  color: '$text',

  variants: {
    variant: {
      title: {
        fontSize: 32,
        lineHeight: 34,
      },
      body: {
        fontSize: 16,
        lineHeight: 18,
      },
    },
    color: {
      primary: {
        color: '$primary',
      },
      secondary: {
        color: '$secondary',
      },
      white: {
        color: '#fff',
      },
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});
