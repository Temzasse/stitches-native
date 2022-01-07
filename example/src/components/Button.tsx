import type * as Stitches from 'stitches-native';
import { styled } from '../styles';
import { Text } from './Text';

type StyledButtonVariants = Stitches.VariantProps<typeof StyledButton>;

type Props = StyledButtonVariants & {
  children: string;
};

export function Button({ children, ...props }: Props) {
  return (
    <StyledButton {...props}>
      <Text variant="body">{children}</Text>
    </StyledButton>
  );
}

const StyledButton = styled('TouchableOpacity', {
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 999,
  minWidth: 100,
  backgroundColor: '$primary',
  shadow: 'medium',

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
        shadow: 'none',
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
