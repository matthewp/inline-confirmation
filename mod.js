const styles = document.createElement('style');
styles.textContent = /* css */ `
  :host {
    display: inline-block;
  }

  .inline-confirm {
    padding: 5px;
  }

  .active {
    background-color: var(--active-bg, #c21807);
    color: var(--active-fg, #000);
  }

  .active button.link:hover {
    color: #fff;
  }

  button.link {
    border: none;
    background-color: transparent;
    cursor: pointer;
    color: inherit;
    font-size: 100%;
    text-decoration: underline;
  }

  button.link:hover {
    color: var(--theme-accent);
  }

  button.link:focus {
    outline: none;
  }

  ::slotted([slot=confirm]) {
    font-size: 18px;
  }
`;

const template = document.createElement('template');
template.innerHTML = /* html */ `
  <div class="confirm">
    <slot name="confirm"></slot>
    <span class="yes">
      <slot name="yes">
        <button data-event="confirm" class="link">Yes</button>
      </slot>
    </span>
    <span class="no">
      <slot name="no">
        <button data-event="cancel" class="link">No</button>
      </slot>
    </span>
  </div>
`;

function clone() {
  return document.importNode(template.content, true).firstElementChild;
}

function conditional(left, right, parent) {
  function remove(node) {
    if(node.parentNode === parent) {
      parent.removeChild(node);
    }
  }

  function update(showLeft) {
    if(showLeft) {
      parent.insertBefore(left, right);
      remove(right); 
    } else {
      parent.insertBefore(right, left);
      remove(left);
    }
  }

  return update;
}

class InlineConfirmation {
  constructor(host) {
    this.active = false;

    this.host = host;
    let doc = host.ownerDocument;
    this.root = doc.createElement('div');
    this.root.classList.add('inline-confirm');
    this.root.appendChild(styles.cloneNode(true));
    this.contentSlot = doc.createElement('slot');
    this.contentSlot.setAttribute('name', 'content');
    this.root.appendChild(this.contentSlot);

    let activeContent = clone();
    this.buttons = activeContent.querySelectorAll('button');
    this.showConfirm = conditional(activeContent, this.contentSlot, this.root);
  }

  setActive(value) {
    if(value !== this.active) {
      this.active = value;
      this.showConfirm(value);
    }
  }

  connect() {
    for(let button of this.buttons) {
      button.addEventListener('click', this);
    }
  }

  disconnect() {
    for(let button of this.buttons) {
      button.removeEventListener('click', this);
    }
  }

  handleEvent(ev) {
    let eventName = ev.target.dataset.event;
    let event = new CustomEvent(eventName);
    this.host.dispatchEvent(event);
    this.host.active = false;
  }

  update(data = {}) {
    if(data.active != null) this.setActive(data.active);
    return this.root;
  }
}

const VIEW = Symbol('view');

class InlineConfirmationElement extends HTMLElement {
  static get observedAttributes() {
    return ['active'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this[VIEW] = new InlineConfirmation(this);
  }

  attributeChangedCallback(prop, _, newVal) {
    this[prop] = newVal === '';
  }

  connectedCallback() {
    if(!this.shadowRoot.firstChild) {
      let frag = this[VIEW].update();
      this.shadowRoot.appendChild(frag);
    }
    this[VIEW].connect();
  }

  disconnectedCallback() {
    this[VIEW].disconnect();
  }

  get active() {
    return this[VIEW].active;
  }

  set active(active) {
    let hasAttr = this.hasAttribute('active');
    if(active && !hasAttr) {
      this.setAttribute('active', '');
    } else if(!active && hasAttr) {
      this.removeAttribute('active');
    }

    this[VIEW].update({ active });
  }
}

customElements.define('inline-confirmation', InlineConfirmationElement);