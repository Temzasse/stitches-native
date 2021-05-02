import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { styled, css } from './styled';

export default function App() {
  return (
    <>
      <Wrapper>
        <Button variant="primary">
          <ButtonText>Hello</ButtonText>
        </Button>

        <Button variant="secondary" style={{ marginTop: 16 }}>
          <ButtonText>Hello</ButtonText>
        </Button>

        <Button variant="secondary" outlined style={{ marginTop: 16 }}>
          <ButtonText>Hello</ButtonText>
        </Button>
      </Wrapper>

      <StatusBar style="auto" />
    </>
  );
}

const buttonStyles = css({
  color: 'black',
  backgroundColor: 'orange',
});

const Wrapper = styled('View', {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#eee',
});

const Button = styled('TouchableOpacity', {
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 999,
  minWidth: 100,

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
        borderColor: 'blueviolet',
        backgroundColor: 'transparent',
      },
    },
    {
      variant: 'secondary',
      outlined: true,
      css: {
        borderColor: 'lightgray',
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
  color: 'white',
});
