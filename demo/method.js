import { html } from 'lit-html';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-button.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-group.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
import '../authorization-method.js';

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'demoState',
      'compatibility',
      'outlined',
      'authType',
      'mainChangesCounter',
      'basicChangesCounter',
      'bearerChangesCounter',
      'ntlmChangesCounter',
      'digestChangesCounter',
      'oauth1ChangesCounter',
      'oauth2ChangesCounter',
      'oauth2BaseUriEnabled',
    ]);
    this.componentName = 'authorization-method';
    this.darkThemeActive = false;
    this.oauth2BaseUriEnabled = false;
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this.demoState = 0;
    this.authType = 'basic';
    this.mainChangesCounter = 0;
    this.basicChangesCounter = 0;
    this.bearerChangesCounter = 0;
    this.ntlmChangesCounter = 0;
    this.digestChangesCounter = 0;
    this.oauth1ChangesCounter = 0;
    this.oauth2ChangesCounter = 0;
    this.oauth2redirect = 'http://auth.advancedrestclient.com/arc.html';
    this.oauth2scopes = [
      'profile',
      'email'
    ];
    this.authorizationUri = `${window.location.protocol}//${window.location.host}${window.location.pathname}oauth-authorize.html`;

    this._authTypeHandler = this._authTypeHandler.bind(this);
    this._mainChangeHandler = this._mainChangeHandler.bind(this);
    this._basicChangeHandler = this._basicChangeHandler.bind(this);
    this._bearerChangeHandler = this._bearerChangeHandler.bind(this);
    this._ntlmChangeHandler = this._ntlmChangeHandler.bind(this);
    this._digestChangeHandler = this._digestChangeHandler.bind(this);
    this._oauth1ChangeHandler = this._oauth1ChangeHandler.bind(this);
    this._oauth2ChangeHandler = this._oauth2ChangeHandler.bind(this);

    window.addEventListener('oauth1-token-requested', this._oauth1TokenHandler.bind(this));
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.demoState = state;
    this.outlined = state === 1;
    this.compatibility = state === 2;
    this._updateCompatibility();
  }

  _authTypeHandler(e) {
    const { name, checked, value } = e.target;
    if (!checked) {
      return;
    }
    this[name] = value;
  }

  _mainChangeHandler() {
    this.mainChangesCounter++;
  }

  _basicChangeHandler() {
    this.basicChangesCounter++;
  }

  _bearerChangeHandler() {
    this.bearerChangesCounter++;
  }

  _ntlmChangeHandler() {
    this.ntlmChangesCounter++;
  }

  _digestChangeHandler() {
    this.digestChangesCounter++;
  }

  _oauth1ChangeHandler() {
    this.oauth1ChangesCounter++;
  }

  _oauth2ChangeHandler(e) {
    this.oauth2ChangesCounter++;
    const result = e.target.serialize();
    console.log(result);
  }

  _oauth1TokenHandler(e) {
    e.preventDefault();
    setTimeout(() => this._dispatchOauth1Token(), 1000);
  }

  _dispatchOauth1Token() {
    const e = new CustomEvent('oauth1-token-response', {
      bubbles: true,
      detail: {
        oauth_token: 'dummy-token',
        oauth_token_secret: 'dummy-secret',
      }
    });
    document.body.dispatchEvent(e);
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      authType,
      mainChangesCounter,
      demoState,
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the authorization method element with various
          configuration options.
        </p>
        <arc-interactive-demo
          .states="${demoStates}"
          .selectedState="${demoState}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <authorization-method
            ?compatibility="${compatibility}"
            ?outlined="${outlined}"
            type="${authType}"
            slot="content"
            @change="${this._mainChangeHandler}"
          ></authorization-method>

          <label slot="options" id="listTypeLabel">Auth type</label>
          <anypoint-radio-group
            slot="options"
            selectable="anypoint-radio-button"
            aria-labelledby="listTypeLabel"
          >
            <anypoint-radio-button
              @change="${this._authTypeHandler}"
              checked
              name="authType"
              value="basic"
              >Basic</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._authTypeHandler}"
              name="authType"
              value="bearer"
              >Bearer</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._authTypeHandler}"
              name="authType"
              value="ntlm"
              >NTLM</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._authTypeHandler}"
              name="authType"
              value="digest"
              >Digest</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._authTypeHandler}"
              name="authType"
              value="oauth 1"
              >OAuth 1</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._authTypeHandler}"
              name="authType"
              value="oauth 2"
              >OAuth 2</anypoint-radio-button
            >
          </anypoint-radio-group>
        </arc-interactive-demo>
        <p>Change events counter: ${mainChangesCounter}</p>
      </section>
    `;
  }

  _demoBasic() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      basicChangesCounter,
      demoState,
    } = this;
    return html`
    <section class="documentation-section">
      <h3>Basic authentication</h3>
      <arc-interactive-demo
        .states="${demoStates}"
        .selectedState="${demoState}"
        @state-changed="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <authorization-method
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          type="basic"
          username="basic-username"
          password="basic-password"
          slot="content"
          @change="${this._basicChangeHandler}"
        ></authorization-method>
      </arc-interactive-demo>
      <p>Change events counter: ${basicChangesCounter}</p>
    </section>
    `;
  }

  _demoBearer() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      bearerChangesCounter,
      demoState,
    } = this;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJuYW1lIjoiUGF3ZWwgUHN6dHljIiwiaWF0IjoxNTE2MjM5MDIyfQ.B-rxe6eH6_Fe9IlmONesmL972amHj0B7rsbNJyiNsT0';
    return html`
    <section class="documentation-section">
      <h3>Bearer authentication</h3>
      <arc-interactive-demo
        .states="${demoStates}"
        .selectedState="${demoState}"
        @state-changed="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <authorization-method
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          type="bearer"
          token="${token}"
          slot="content"
          @change="${this._basicChangeHandler}"
        ></authorization-method>
      </arc-interactive-demo>
      <p>Change events counter: ${bearerChangesCounter}</p>
    </section>
    `;
  }

  _demoNtlm() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      ntlmChangesCounter,
      demoState,
    } = this;
    return html`
    <section class="documentation-section">
      <h3>NTLM authentication</h3>
      <arc-interactive-demo
        .states="${demoStates}"
        .selectedState="${demoState}"
        @state-changed="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <authorization-method
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          type="ntlm"
          username="ntlm-username"
          password="ntlm-password"
          domain="ntlm-domain"
          slot="content"
          @change="${this._ntlmChangeHandler}"
        ></authorization-method>
      </arc-interactive-demo>
      <p>Change events counter: ${ntlmChangesCounter}</p>
    </section>
    `;
  }

  _demoDigest() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      demoState,
      digestChangesCounter,
    } = this;
    return html`
    <section class="documentation-section">
      <h3>Digest authentication</h3>
      <arc-interactive-demo
        .states="${demoStates}"
        .selectedState="${demoState}"
        @state-changed="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <authorization-method
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          type="digest"
          username="digest-username"
          password="digest-password"
          realm="digest-realm"
          nonce="digest-nonce"
          opaque="digest-opaque"
          algorithm="MD5-sess"
          requestUrl="https://api.domain.com/v0/endpoint"
          slot="content"
          @change="${this._digestChangeHandler}"
        ></authorization-method>
      </arc-interactive-demo>
      <p>Change events counter: ${digestChangesCounter}</p>
    </section>
    `;
  }

  _demoOauth1() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      demoState,
      oauth1ChangesCounter,
    } = this;
    const redirect = 'http://localhost:8001/node_modules/@advanced-rest-client/oauth-authorization/oauth-popup.html';
    return html`
    <section class="documentation-section">
      <h3>OAuth 1 authentication</h3>
      <arc-interactive-demo
        .states="${demoStates}"
        .selectedState="${demoState}"
        @state-changed="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <authorization-method
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          type="oauth 1"
          slot="content"
          @change="${this._oauth1ChangeHandler}"
          consumerKey="key"
          consumerSecret="secret"
          redirectUri="${redirect}"
          token="oauth 1 token"
          tokenSecret="oauth 1 token secret"
          requestTokenUri="http://term.ie/oauth/example/request_token.php"
          accessTokenUri="http://term.ie/oauth/example/access_token.php"
          authTokenMethod="GET"
          authParamsLocation="querystring"
        ></authorization-method>
      </arc-interactive-demo>
      <p>Change events counter: ${oauth1ChangesCounter}</p>
    </section>
    `;
  }

  _demoOauth2() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      demoState,
      oauth2ChangesCounter,
      oauth2redirect,
      authorizationUri,
      oauth2scopes,
      oauth2BaseUriEnabled,
    } = this;
    const baseUri = oauth2BaseUriEnabled ? 'https://api.domain.com/auth/' : undefined;
    return html`
    <section class="documentation-section">
      <h3>OAuth 2 authentication</h3>
      <arc-interactive-demo
        .states="${demoStates}"
        .selectedState="${demoState}"
        @state-changed="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <authorization-method
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          type="oauth 2"
          slot="content"
          redirectUri="${oauth2redirect}"
          authorizationUri="${authorizationUri}"
          accessTokenUri="https://api.domain.com/token"
          clientId="test-client-id"
          grantType="authorization_code"
          pkce
          .baseUri="${baseUri}"
          .scopes="${oauth2scopes}"
          @change="${this._oauth2ChangeHandler}"
        ></authorization-method>

        <label slot="options" id="mainOptionsLabel">Options</label>
        <anypoint-checkbox
          aria-describedby="mainOptionsLabel"
          slot="options"
          name="oauth2BaseUriEnabled"
          @change="${this._toggleMainOption}">Add base URI</anypoint-checkbox>
      </arc-interactive-demo>
      <p>Change events counter: ${oauth2ChangesCounter}</p>
    </section>
    `;
  }

  contentTemplate() {
    return html`
      <oauth2-authorization></oauth2-authorization>
      <h2>Authorization method</h2>
      ${this._demoTemplate()}
      ${this._demoBasic()}
      ${this._demoBearer()}
      ${this._demoNtlm()}
      ${this._demoDigest()}
      ${this._demoOauth1()}
      ${this._demoOauth2()}
    `;
  }
}

const instance = new ComponentDemo();
instance.render();