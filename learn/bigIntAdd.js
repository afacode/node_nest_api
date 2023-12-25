function add(a, b) {
  let maxLength = Math.max(a.length, b.length);
  a = a.padStart(maxLength, 0);
  b = b.padStart(maxLength, 0);
  //声明加法过程中需要用到的变量
  let t = 0;
  let f = 0; //"进位"
  let sum = ''; // sum 声明为空字符串
  for (let i = maxLength - 1; i >= 0; i--) {
    t = parseInt(a[i]) + parseInt(b[i]) + f;
    // 取地板数，比如 9/10 取 0， 11/10 取 1
    f = Math.floor(t / 10);
    // 取模，个位数与 10 取模为它本身，即余数
    // 因为 sum 声明为空字符串，所以数字会被转换成字符串
    // 比如 8 + "9" 输出为字符串 "89"
    sum = (t % 10) + sum;
  }
  //最后得到的 sum 时， f 为 1 即在前加 1
  //假设此时 sum 为 "xxx", f 为 1，则返回"1xxx"
  if (f == 1) {
    sum = '1' + sum;
  }
  return sum;
}
