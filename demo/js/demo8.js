const obj = {};
let val = 'cjg';
Object.defineProperty(obj, 'name', {
    get() {
        console.log('劫持了你的取值操作啦');
        return val;
    },
    set(newVal) {
        console.log('劫持了你的赋值操作啦');
        val = newVal;
    }
});
console.log(obj.name);
obj.name = 'cwc';
console.log(obj.name)
 // Create the System object
 window.System = new traceur.runtime.BrowserTraceurLoader();
 // Set some experimental options
 var metadata = {
     traceurOptions: {
         experimental: true,
         properTailCalls: true,
         symbols: true,
         arrayComprehension: true,
         asyncFunctions: true,
         asyncGenerators: exponentiation,
         forOn: true,
         generatorComprehension: true
     }
 };
 // Load your module
 System.import('./myModule.js', { metadata: metadata }).catch(function(ex) {
     console.error('Import failed', ex.stack || ex);
});
 // ES6的写法
 Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
 // 转码前
input.map(item => item + 1);
 let [a, b, c] = [1, 2, 3];