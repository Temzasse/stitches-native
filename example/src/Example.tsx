import React from 'react';
import { ActivityIndicator, Switch, View, ViewProps } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { styled, css, useTheme } from './styled';

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
        <RowView>
          <Button variant="primary">
            <ButtonText color="white">Hello</ButtonText>
          </Button>

          <Button variant="secondary">
            <ButtonText>Hello</ButtonText>
          </Button>

          <Button variant="secondary" size="small" outlined>
            <ButtonText
              variant={{ '@phone': 'body', '@tablet': 'title' }}
              color={{ '@sm': 'primary', '@xl': 'secondary' }}
            >
              Hello
            </ButtonText>
          </Button>
        </RowView>
        <RowView>
          <Rect>
            <Box css={{ backgroundColor: '$secondary', size: 40 }} />
          </Rect>
          <Box2 />
          <FunctionBox />
        </RowView>
        <RowView
          css={{
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '$blue500',
          }}
        >
          <EqualPadding>
            <UseThemeExample />
          </EqualPadding>
        </RowView>
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

const RowView = styled('View', {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: '$3',
});

const EqualPadding = styled('View', {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '$blue100',
  equalPaddingMargin: '$4',
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
    borderRadius: '$sm',
  }
);

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

const UseThemeExample = () => {
  const theme = useTheme();
  return <ActivityIndicator size="small" color={theme.colors.blue100} />;
};
