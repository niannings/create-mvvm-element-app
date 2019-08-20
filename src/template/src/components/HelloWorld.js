import { MvvmElement } from 'mvvm-element';

const template = `
  <div>{{ message }}</div>
`;

export default class HelloWorld extends MvvmElement {
  constructor() {
    super({
      template,
      state: {
        message: "hello world!"
      }
    });
  }
}
