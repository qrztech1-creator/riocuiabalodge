import { serveLpHtml } from '../serve-lp';

export const dynamic = 'force-static';

export function GET() {
  return serveLpHtml('privacidade.html');
}
