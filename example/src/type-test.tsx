import { styled, css } from './styles';

const View = styled('View', {});

const csstest = css({
  fontSize: 16,
});

export const Test = <View css={csstest} />;
