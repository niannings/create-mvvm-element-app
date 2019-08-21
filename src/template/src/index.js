import mvvm, { register } from 'mvvm-element';
import HelloWorld from './components/HelloWorld.js';
import './assets/style/index.css';

register('wlxm-hello-world', HelloWorld);

mvvm({
  el: document.querySelector('#app'),
  data: {
    time: new Date().toLocaleTimeString()
  },
  // setup will only be executed once
  setup(ctx) {
    updateClock(ctx);

    return {
      // event handler
      handleClick() {
        // do sth
      }
    };
  }
});

function updateClock(state) {
  setTimeout(() => {
    state.time = new Date().toLocaleTimeString();

    updateClock(state);
  }, 1000);
}
