import { Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Stack, Text, useColorMode, Media, Heading } from './components';
import { styled } from './styles';

export default function Example() {
  const { toggleColorMode, colorMode } = useColorMode();
  const [example, changeExample] = useState(false);

  return (
    <Wrapper>
      <Content>
        <Stack axis="y" space="4">
          <Stack axis="x" space="3" align="center">
            <Text variant="title1">Example app</Text>
            <Stack axis="y" space="2">
              <Text variant="body">Switch Examples</Text>
              <Switch value={example} onValueChange={changeExample} />
            </Stack>
          </Stack>
          {example && (
            <Stack axis="y" space="2">
              <Heading>Variants</Heading>
              <Heading heading="h2">Heading</Heading>
              <Heading heading="h3">Heading</Heading>
              <Heading heading="h4">Heading</Heading>
              <Heading heading="h5">Heading</Heading>
              <Heading
                // NOTE: test inline media style.
                // marginTopRem util function turns media style.
                css={{
                  marginTopRem: 1,
                }}
                underlined
              >
                Compound Variants
              </Heading>
              <Heading underlined heading="h2">
                Heading
              </Heading>
              <Heading underlined heading="h3">
                Heading
              </Heading>
              <Heading underlined heading="h4">
                Heading
              </Heading>
              <Heading underlined heading="h5">
                Heading
              </Heading>
              <Heading>Media</Heading>
              <Heading
                heading={{
                  '@initial': 'h5',
                }}
                underlined={{
                  '@initial': false,
                  '@phone': true,
                }}
              >
                Underlined appears on phone
              </Heading>
              <Heading
                heading="h5"
                // NOTE: media style can be marged and overwriten by later applied media styles.
                css={{
                  '@phone': {
                    borderColor: 'white',
                    borderRightWidth: 1,
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    borderBottomWidth: 1,
                  },
                  '@md': {
                    borderColor: 'black',
                  },
                }}
              >
                Square border appears on md Phone
              </Heading>
            </Stack>
          )}
          {!example && (
            <>
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

              <Media
                color={{
                  '@xxl': 'primary',
                  '@xl': 'secondary',
                  '@lg': 'third',
                  '@md': 'forth',
                  '@sm': 'fifth',
                }}
              >
                Font size and color should change as viewport changes
              </Media>

              <Stack axis="x" space="3" align="center" justify="end">
                <Text variant="body">Toggle color mode</Text>
                <Switch
                  value={colorMode === 'dark'}
                  onValueChange={toggleColorMode}
                />
              </Stack>
            </>
          )}
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
