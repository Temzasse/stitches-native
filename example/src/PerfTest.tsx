import { useMemo } from 'react';
import { Stack } from './components';
import { styled } from './styles';

let measured = false;

export default function PerfTest() {
  const start = useMemo(() => new Date(), []);

  return (
    <Wrapper
      onLayout={() => {
        if (!measured) {
          measured = true;
          console.log(
            `Time taken: ${new Date().getTime() - start.getTime()} ms`
          );
        }
      }}
    >
      <Content>
        <Stack axis="y" space="4">
          {Array.from({ length: 1000 }).map((_, i) => (
            <Box key={i}>
              <BoxText>{i + 1}</BoxText>
            </Box>
          ))}
        </Stack>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled('SafeAreaView', {
  flex: 1,
  backgroundColor: '$background',
});

const Content = styled('ScrollView', {
  flex: 1,
}).attrs((p) => ({
  contentContainerStyle: {
    padding: p.theme.space[2],
  },
}));

const Box = styled('View', {
  minHeight: 100,
  backgroundColor: '$primaryMuted',
  flexCenter: 'row',
  borderRadius: '$md',
});

const BoxText = styled('Text', {
  color: '$primaryText',
});
