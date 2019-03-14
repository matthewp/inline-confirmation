# &lt;inline-confirmation&gt;

A component to display a confirmation inline with a button. When you want to display a confirmation button when a user takes action on a button, such as a __delete__ button but don't want to do the usual thing of display a dialog window as confirmation, inline-confirmation provides a nice alternative.

![Example usage of inline-confirmation](https://user-images.githubusercontent.com/361671/54353030-60042a80-4629-11e9-9155-7bc456946cb1.gif)

## Example

You can use inline-confirmation with unpkg:

```html
<script type="module" src="https://unpkg.com/inline-confirmation/mod.js"></script>

<inline-confirmation>
  <span slot="confirm">Are you sure?</span>
  <button type="button" slot="content">Delete account</button>
</inline-confirmation>
```

## Install

Available on npm:

```shell
npm install inline-confirmation
```

Or with Yarn:

```shell
yarn add inline-confirmation
```

## API

The following is all you need to know:

### Attributes

__active__: Displayed when the confirmation message is shown.

This can be set via a property:

```js
let confirmation = document.querySelector('inline-confirmation');

confirmation.active = true;
```

Or via the attribute:

```html
<inline-confirmation active> ... </inline-confirmation>
```

In addition to showing the confirmation message, this is also useful for styling.

```css
inline-confirmation[active] {
  background: tomato;
  padding: .5em 1em;
  width: 15rem;
  --confirm-button-hover-color: #fff;
}
```

### Events

__confirm__: Fired when the user confirms the action. By default this is the __Yes__ button, but this can be modified with slots.

```js
let confirmation = document.querySelector('inline-confirmation');

confirmation.addEventListener('confirm', () => {
  // Here's where we delete the account
});
```

__cancel__: Fired when the user selects to cancel the action. By default this is the __No__ button.

```js
let confirmation = document.querySelector('inline-confirmation');

confirmation.addEventListener('cancel', () => {
  // Might want to do something in response to this.
});
```

### Slots

There are a few slots to customize the appearance.

__confirm__: A message to be displayed when confirmation mode is active. This could be more information about what the action will actually do, usually to act as a warning.

```html
<inline-confirmation>
  <span slot="confirm">Are you sure?</span>
</inline-confirmation>
```

__content__: This is the content to display when confirmation mode is *not active*. Usually this is just the button you want to display for the action to perform. You might display something else here, like a *Loading...* message when the action actually occurs post-confirmation.

```html
<inline-confirmation>
  <button type="button" slot="content">Delete account</button>
</inline-confirmation>
```

__yes__: This is a slot that allows you to customize the confirm button. By default it is a button that looks like a link displaying __Yes__. Here we change this slightly:

```html
<inline-confirmation>
  <slot name="yes">Confirm</slot>
</inline-confirmation>
```

__no__: This is a slot that allows customizing the cancel button. By default this is a button that displays __No__.

```html
<inline-confirmation>
  <slot name="no">Cancel</slot>
</inline-confirmation>
```

### CSS Variables

__--confirm-button-color__: Changes the color of the confirm and cancel buttons. By default the color is inherited.

__--confirm-button-hover-color__: Changes the color of the confirm and cancel buttons in their hover state. Here we are showing a white color in the hover state:

```css
inline-confirmation {
  --confirm-button-hover-color: #fff;
}
```

## License

BSD-2-Clause