import statementAnchorSvg from '../assets/imgs/statement_anchor.svg';
import statementAnchorLightSvg from '../assets/imgs/statement_anchor_light.svg';

export function getStatementSvg(connected?: boolean) {
  return connected ? statementAnchorSvg : statementAnchorLightSvg
}
