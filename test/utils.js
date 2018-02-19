function getEvents(tx, event = null) {
  const stack = [];

  tx.logs.forEach((item) => {
      if (event) {
          if (event === item.event) {
              stack.push(item.args);
          }
      } else {
          if (!stack[item.event]) {
              stack[item.event] = [];
          }
          stack[item.event].push(item.args);
      }
  });

  if (Object.keys(stack).length === 0) {
      throw new Error('No Events fired');
  }

  return stack;
}

function Sig(account, msg) {
  return new Promise((res, rej) => {
    web3.eth.sign(account, msg, (err, sig) => {
      sig = sig.substr(2);
      let r = '0x' + sig.substr(0,64);
      let s = '0x' + sig.substr(64, 64);
      let v = web3.toDecimal(sig.substr(128, 2)) + 27;
      res({r, s, v});
    });
  });
}

module.exports = {getEvents, Sig};