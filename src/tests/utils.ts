const aspectRatio = 19.5 / 9; // iPhone 14

export function mockDimensions({
  width = 750,
  height = width * aspectRatio,
}: {
  width?: number;
  height?: number;
}) {
  jest.resetModules();
  jest.doMock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({ width, height }),
  }));
}
