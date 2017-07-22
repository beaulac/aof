import { AofNg2Page } from './app.po';

describe('aof-ng2 App', () => {
  let page: AofNg2Page;

  beforeEach(() => {
    page = new AofNg2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
