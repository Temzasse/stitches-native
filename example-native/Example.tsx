import React from 'react';
import { Switch } from 'react-native';
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
            variant={{ phone: 'body', tablet: 'title' }}
            color="secondary"
          >
            Hello
          </ButtonText>
        </Button>

        <Rect>
          <Box css={{ backgroundColor: '$secondary', size: 40 }} />
        </Rect>
      </Wrapper>

      <StatusBar style="auto" />
    </>
  );
}

const someStyles = css({
  backgroundColor: 'orange',
  size: 20,
});

const Wrapper = styled('View', {
  flex: 1,
  flexShrink: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$background',
});

const Box = styled('View', {});

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
  color: '#000',

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
