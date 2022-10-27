import { Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Stack, Text, useColorMode } from './components';
import { styled } from './styles';

export default function Example() {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Wrapper>
      <Content>
        <Stack axis="y" space="4">
          <Text variant="title1">Example app</Text>

          <Stack axis="y" space="2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Box key={i}>
                <Stack axis="x" space="4">
                  <Text variant="body" color="primaryText">
                    Box {i + 1}
                  </Text>
                  <Text variant="body" color="primaryText">
                    XXX
                  </Text>
                  <Text variant="body" color="primaryText">
                    YYY
                  </Text>
                </Stack>
              </Box>
            ))}
          </Stack>

          <Stack axis="x" space="3" align="center" justify="end">
            <Text variant="body">Toggle color mode</Text>
            <Switch
              value={colorMode === 'dark'}
              onValueChange={toggleColorMode}
            />
          </Stack>
        </Stack>
      </Content>

      <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
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
