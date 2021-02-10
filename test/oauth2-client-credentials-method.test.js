import { html, fixture, assert, oneEvent, nextFrame } from '@open-wc/testing';
import { spy } from 'sinon';
import { tap } from '@polymer/iron-test-helpers/mock-interactions.js';
import { AuthorizationEventTypes } from '@advanced-rest-client/arc-events';
import { METHOD_OAUTH2 } from '../index.js';
import '../authorization-method.js';

/** @typedef {import('../src/AuthorizationMethod').AuthorizationMethod} AuthorizationMethod */
/** @typedef {import('@anypoint-web-components/anypoint-input').AnypointInput} AnypointInput */
/** @typedef {import('@anypoint-web-components/anypoint-dropdown-menu').AnypointDropdownMenu} AnypointDropdownMenu */
/** @typedef {import('@anypoint-web-components/anypoint-listbox').AnypointListbox} AnypointListbox */

describe('OAuth 2, client credentials method', () => {
  const grantType = 'client_credentials';
  const inputFields = [
    ['clientId', '821776164331-rserncqpdsq32lmbf5cfeolgcoujb6fm.apps.googleusercontent.com'],
    ['accessTokenUri', 'https://accounts.google.com/o/oauth2/v2/token'],
    ['scopes', ['email', 'profile']],
    ['clientSecret', 'cc-secret'],
    ['ccDeliveryMethod', 'header']
  ];

  function createParamsMap() {
    const props = {
      grantType,
    };
    inputFields.forEach(([n, v]) => {props[n] = v});
    return props;
  }

  /**
   * @param {any=} opts
   * @returns {Promise<AuthorizationMethod>}
   */
  async function basicFixture(opts={}) {
    const {
      clientId,
      clientSecret,
      accessTokenUri,
      scopes,
      ccDeliveryMethod,
    } = opts;
    return (fixture(html`<authorization-method
      type="${METHOD_OAUTH2}"
      grantType="client_credentials"
      .clientId="${clientId}"
      .clientSecret="${clientSecret}"
      .accessTokenUri="${accessTokenUri}"
      .scopes="${scopes}"
      .ccDeliveryMethod="${ccDeliveryMethod}"></authorization-method>`));
  }

  /**
   * @param {string=} baseUri
   * @param {any=} opts
   * @returns {Promise<AuthorizationMethod>}
   */
  async function baseUriFixture(baseUri, {
    clientId = undefined,
    clientSecret = undefined,
    accessTokenUri = undefined,
    scopes = undefined
  } = {}) {
    return (fixture(html`<authorization-method
      type="${METHOD_OAUTH2}"
      grantType="client_credentials"
      .clientId="${clientId}"
      .clientSecret="${clientSecret}"
      .accessTokenUri="${accessTokenUri}"
      .scopes="${scopes}"
      .baseUri="${baseUri}"
    ></authorization-method>`));
  }

  describe('DOM rendering', () => {
    let element = /** @type AuthorizationMethod */ (null);
    let form = /** @type HTMLFormElement */ (null);
    beforeEach(async () => {
      element = await basicFixture();
      form = element.shadowRoot.querySelector('form.oauth2-auth');
    });

    inputFields.forEach(([name]) => {
      it(`form has ${name} input`, async () => {
        const input = form.querySelector(`*[name="${name}"]`);
        assert.ok(input);
      });
    });

    it('client secret is not required', async () => {
      const input = /** @type AnypointInput */ (form.querySelector('*[name="clientSecret"]'));
      assert.notOk(input.required);
    });

    it('does not render the redirect URI field', async () => {
      const section = element.shadowRoot.querySelector('.redirect-section');
      assert.notOk(section);
    });
  });

  describe('Advanced mode', () => {
    it('renders all fields when no initial values', async () => {
      const element = await basicFixture();
      assert.isTrue(element.advancedOpened, 'advanced view is opened');
      assert.isUndefined(element.advanced, 'advanced is undefined');
    });

    it('does not render advanced switch', async () => {
      const element = await basicFixture();
      const node = element.shadowRoot.querySelector('.adv-toggle');
      assert.notOk(node);
    });

    it('hides advanced fields when has all data', async () => {
      const element = await basicFixture(createParamsMap());
      assert.isFalse(element.advancedOpened, 'advanced view is not opened');
      assert.isTrue(element.advanced, 'advanced is set');
    });

    it('renders advanced switch when advanced is enabled', async () => {
      const element = await basicFixture(createParamsMap());
      const node = element.shadowRoot.querySelector('.adv-toggle');
      assert.ok(node);
    });

    it('toggles advanced visibility when switch is clicked', async () => {
      const element = await basicFixture(createParamsMap());
      const section = element.shadowRoot.querySelector('.advanced-section');
      assert.equal(getComputedStyle(section).display, 'none', 'section is hidden');
      const button = element.shadowRoot.querySelector('.adv-settings-input');
      tap(button);
      await nextFrame();
      assert.equal(getComputedStyle(section).display, 'block', 'section is not hidden');
    });

    it('does not render PKCE checkbox', async () => {
      const element = await basicFixture(createParamsMap());
      const node = element.shadowRoot.querySelector('[name="pkce"]');
      assert.notOk(node);
    });

    it('renders the delivery method drop down', async () => {
      const element = await basicFixture(createParamsMap());
      const input = /** @type AnypointInput */ (element.shadowRoot.querySelector('*[name="ccDeliveryMethod"]'));
      assert.ok(input);
    });
  });

  describe('Data initialization', () => {
    let element = /** @type AuthorizationMethod */ (null);
    beforeEach(async () => {
      element = await basicFixture(createParamsMap());
    });

    inputFields.forEach(([name, value]) => {
      it(`input ${name} has value`, async () => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector(`*[name="${name}"]`));
        if (node.localName === 'anypoint-input') {
          const input = /** @type AnypointInput */ (node);
          assert.equal(input.value, value);
        } else if (node.localName === 'anypoint-dropdown-menu') {
          const menu = /** @type AnypointDropdownMenu */ (node);
          const list = /** @type AnypointListbox */ (menu.children[1]);
          assert.equal(String(list.selected), value);
        }
      });
    });
  });

  describe('Change notification', () => {
    let element = /** @type AuthorizationMethod */ (null);
    beforeEach(async () => {
      element = await basicFixture({});
    });

    inputFields.forEach(([name, value]) => {
      it(`notifies when ${name} changes`, async () => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector(`*[name="${name}"]`));
        setTimeout(() => {
          if (name === 'ccDeliveryMethod') {
            const menu = /** @type AnypointDropdownMenu */ (node);
            const list = /** @type AnypointListbox */ (menu.children[1]);
            list.selected = String(value);
            list.dispatchEvent(new CustomEvent('change'));
          } else if (name === 'scopes') {
            const input = /** @type AnypointInput */ (node);
            input.value = value;
            input.dispatchEvent(new CustomEvent('change'));
          } else {
            const input = /** @type AnypointInput */ (node);
            input.value = value;
            input.dispatchEvent(new CustomEvent('input'));
          }
        });
        const e = await oneEvent(element, 'change');
        assert.ok(e);
      });
    });
  });

  describe('Data serialization', () => {
    let element = /** @type AuthorizationMethod */ (null);
    beforeEach(async () => {
      element = await basicFixture(createParamsMap());
    });

    inputFields.forEach(([name, value]) => {
      it(`serialization has ${name}`, async () => {
        const result = element.serialize();
        if (name === 'ccDeliveryMethod') {
          assert.equal(result.deliveryMethod, value);
        } else {
          // @ts-ignore
          assert.equal(result[name], value);
        }
      });
    });
  });

  describe('Data restoration', () => {
    let element = /** @type AuthorizationMethod */ (null);
    let restoreMap;

    beforeEach(async () => {
      element = await basicFixture();
      restoreMap = createParamsMap();
    });

    inputFields.filter(([name]) => name !== 'ccDeliveryMethod').forEach(([name, value]) => {
      it(`restores ${name}`, () => {
        element.restore(restoreMap);
        // @ts-ignore
        assert.equal(element[name], value);
      });
    });

    it('restores deliveryMethod', () => {
      element.restore({ ...restoreMap, deliveryMethod: 'header' });
      assert.equal(element.ccDeliveryMethod, 'header');
    });
  });

  describe('authorization request', () => {
    let element = /** @type AuthorizationMethod */ (null);

    beforeEach(async () => {
      element = await basicFixture(createParamsMap());
    });

    inputFields.filter(([name]) => name !== 'ccDeliveryMethod').forEach(([name, value]) => {
      it(`authorization event has ${name} property`, async () => {
        const handler = spy();
        element.addEventListener(AuthorizationEventTypes.OAuth2.authorize, handler);
        await element.authorize();
        const { detail } = handler.args[0][0];
        // @ts-ignore
        assert.equal(detail[name], value);
      });
    });

    it(`authorization event has the deliveryMethod property`, async () => {
      const handler = spy();
      element.addEventListener(AuthorizationEventTypes.OAuth2.authorize, handler);
      await element.authorize();
      const { detail } = handler.args[0][0];
      assert.equal(detail.deliveryMethod, 'header');
    });
  });

  describe('#baseUri', () => {
    const baseUri = 'https://api.domain.com/auth';

    it('adds base URI to accessTokenUri', async () => {
      const params = createParamsMap();
      params.accessTokenUri = '/authorize';
      const element = await baseUriFixture(baseUri, params);
      const result = element.serialize();
      assert.equal(result.accessTokenUri, 'https://api.domain.com/auth/authorize');
    });

    it('ignores trailing slash', async () => {
      const uri = `${baseUri}/`;
      const params = createParamsMap();
      params.accessTokenUri = '/authorize';
      const element = await baseUriFixture(uri, params);
      const result = element.serialize();
      assert.equal(result.accessTokenUri, 'https://api.domain.com/auth/authorize');
    });

    it('makes accessTokenUri input text type', async () => {
      const element = await baseUriFixture(baseUri, createParamsMap());
      const node = /** @type AnypointInput */ (element.shadowRoot.querySelector('[name="accessTokenUri"]'));
      assert.equal(node.type, 'string');
    });
  });
});
