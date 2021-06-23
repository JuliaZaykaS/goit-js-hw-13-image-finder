import '@pnotify/core/dist/BrightTheme.css';
const { defaults } = require('@pnotify/core');
const { error, notice, Stack } = require('@pnotify/core');
import { refs } from './refs';


const myStack1 = new Stack({
  dir1: 'down',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 25,
  spacing1: 36,
  spacing2: 36,
  push: 'bottom',
  context: refs.formEl,
});

const myStack2 = new Stack({
  dir1: 'down',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 25,
  spacing1: 36,
  spacing2: 36,
  push: 'bottom',
  context: refs.hiddenPointEl,
});

function getError() {
  const myError = error({
    text: 'Ooops, something went wrong',
    stack: myStack1,
  });
}

function getNotice(stack) {
  const myNotice = notice({
    text: 'Please wait, loading...',
    stack: stack,
  });
}

export { myStack1, myStack2, getError, getNotice }