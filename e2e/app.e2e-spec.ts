import { SosoClientUiPage } from './app.po';

describe('soso-client-ui App', function() {
  let page: SosoClientUiPage;

  beforeEach(() => {
    page = new SosoClientUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
