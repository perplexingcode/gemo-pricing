Object.prototype.toggleState = function (key) {
  console.log('ai cha chat nhi');
  if (this?.state === undefined) {
    this.state = {};
  }
  const state = this.state;
  state[key] = !state[key];
};
