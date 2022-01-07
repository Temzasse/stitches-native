import { StatusBar } from 'expo-status-bar';
import { styled, css } from 'stitches-native';

export default function Simple() {
  return (
    <>
      <Wrapper>
        <Button variant="primary">
          <ButtonText color="white">Hello</ButtonText>
        </Button>
        <Button variant="primary" outlined>
          <ButtonText color="primary">Hello</ButtonText>
        </Button>
        <Button variant="secondary">
          <ButtonText color="white">World</ButtonText>
        </Button>
        <Button variant="secondary" outlined>
          <ButtonText color="secondary">World</ButtonText>
        </Button>
      </Wrapper>

      <StatusBar style="auto" />
    </>
  );
}

const someStyles = css({
  flex: 1,
  backgroundColor: '#fff',
});

const Wrapper = styled('View', {
  flexShrink: 0,
  justifyContent: 'center',
  alignItems: 'center',
  ...someStyles,
});

const Button = styled('TouchableOpacity', {
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 999,
  minWidth: 100,
  backgroundColor: 'blue',

  variants: {
    variant: {
      primary: {
        backgroundColor: 'tomato',
      },
      secondary: {
        backgroundColor: 'purple',
      },
    },
    size: {
      small: {
        height: 32,
        paddingHorizontal: 8,
      },
      large: {
        height: 44,
        paddingHorizontal: 16,
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
        borderColor: 'tomato',
        backgroundColor: 'transparent',
      },
    },
    {
      variant: 'secondary',
      outlined: true,
      css: {
        borderColor: 'purple',
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
  color: '#222',

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
        color: 'tomato',
      },
      secondary: {
        color: 'purple',
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
