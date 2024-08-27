/** @typedef {import('chai')} */

const expect = (window['expect'] = chai.expect);

describe('Mocha CSS', function () {
  it('should have **correct** _color_ and background when in `light` and `dark` modes', () => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const expectedColors = media.matches
      ? {
          color: 'rgb(210, 210, 210)',
          backgroundColor: 'rgb(34, 34, 34)'
        }
      : {
          color: 'rgb(98, 98, 98)',
          backgroundColor: 'rgb(242, 242, 242)'
        };
    const background = getComputedStyle(document.body).backgroundColor;
    const color = getComputedStyle(document.body).color;

    expect(background).to.equal(expectedColors.backgroundColor);
    expect(color).to.equal(expectedColors.color);
  });

  it('should fail. this is an example of a failing test', () => {
    expect(true).to.equal(false);
  });

  new Array(5).fill('').map(async (_, i) => {
    const ms = (i + 1) * 225;
    xit(`Test at ${ms}ms`, async () => {
      await new Promise(resolve => setTimeout(resolve, ms));
      expect(true).to.equal(true);
    }).timeout(ms + 100);
  });

  it('should be a slow test', async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(true).to.equal(true);
  });
  it('should be a slower test', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(true).to.equal(true);
  });

  it('should be a really slow test', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(true).to.equal(true);
  }).timeout(3000);

  describe('another 5 tests', () => {
    new Array(5).fill('').forEach((_, i) => {
      it(`should pass test ${i + 1}`, () => {
        expect(true).to.equal(true);
      });
    });
  });
});
