const aspectRatio = 19.5 / 9; // iPhone 14

export function mockDimensions({
  width = 750,
  height = width * aspectRatio,
  pixelRatio = 1,
}: {
  width?: number;
  height?: number;
  pixelRatio?: number;
}) {
  jest.resetModules();
  jest.doMock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({ width, height }),
  }));
  jest.doMock('react-native/Libraries/Utilities/PixelRatio', () => ({
    get: () => pixelRatio,
    getFontScale: () => 1,
    getPixelSizeForLayoutSize: (layoutSize: number) => layoutSize * pixelRatio,
    roundToNearestPixel: (layoutSize: number) =>
      Math.round(layoutSize * pixelRatio) / pixelRatio,
  }));
}

export function reduceStyles(s: any) {
  return s.reduce((s1: any, s2: any) => ({ ...s1, ...s2 }), {});
}
