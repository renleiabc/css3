// 基础知识
// const obj = {};
// let val = 'cjg';
// Object.defineProperty(obj, 'name', {
//     get() {
//         console.log('劫持了你的取值操作啦');
//         return val;
//     },
//     set(newVal) {
//         console.log('劫持了你的赋值操作啦');
//         val = newVal;
//     }
// });
// console.log(obj.name);
// obj.name = 'cwc';
// console.log(obj.name);

// // 发布订阅者模式

// class Dep {
//     constructor() {
//         this.subs = [];
//     }

//     // 增加订阅者
//     addSub(sub) {
//         if (this.subs.indexOf(sub) < 0) {
//             this.subs.push(sub)
//         }
//     }
//     // 通知订阅者
//     notify() {
//         console.log(this.subs);
//         this.subs.forEach((sub) => {
//             sub.update();
//         })
//     }
// }
// const dep = new Dep();

// const sub = {
//     update() {
//         console.log('sub1 update');
//     }
// }
// const sub1 = {
//     update() {
//         console.log('sub2 update')
//     }
// }
// dep.addSub(sub);
// dep.addSub(sub1);
// dep.notify(); // 通知订阅者事件发生，触发他们的更新函数
// 动手实践
class Observer {
    constructor(data) {
        // 如果是对象，则返回
        if (!data || typeof data !== 'object') {
            return;
        }
        this.data = data;
        this.walk();
    }
    // 对传入的数据进行数据劫持
    walk() {
        for (let key in this.data) {
            this.defineProperty(this.data, key, this.data[key]);
        }
    }
    // 创建当前属性的一个发布实例，使用Oject.deifneProperty来对当前的属性进行数据劫持。
    defineProperty(obj, key, val) {
        // 创建当前属性的发布者
        const dep = new Dep();
        /*
         * 递归对子属性的值进行数据劫持，比如说对以下数据
         * let data = {
         *   name: 'cjg',
         *   obj: {
         *     name: 'zht',
         *     age: 22,
         *     obj: {
         *       name: 'cjg',
         *       age: 22,
         *     }
         *   },
         * };
         * 我们先对data最外层的name和obj进行数据劫持，之后再对obj对象的子属性obj.name,obj.age, obj.obj进行数据劫持，层层递归下去，直到所有的数据都完成了数据劫持工作。
         */
        new Observer(val);
        Object.defineProperty(obj, key, {
            get() {
                // 若当前有对该属性的依赖项，则将其加入到发布者的订阅队列里
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set(newVal) {
                if (val === newVal) {
                    return;
                }
                val = newVal;
                new Observer(newVal);
                dep.notify();
            }
        })
    }
}
// 发布者,将依赖该属性的watcher都加入subs数组，当该属性改变的时候，则调用所有依赖该属性的watcher的更新函数，触发更新。
class Dep {
    constructor() {
        this.subs = [];
    }
    addSub(sub) {
        if (this.subs.indexOf(sub) < 0) {
            this.subs.push(sub);
        }
    }
    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}
Dep.target = null;
// 观察者；
class Watcher {
    /**
     *Creates an instance of Watcher.
     * @param {*} vm
     * @param {*} keys
     * @param {*} updateCb
     * @memberof Watcher
     */
    constructor(vm, keys, updateCb) {
        console.log(vm,keys)
        console.log(updateCb);
        this.vm = vm;
        this.updateCb = updateCb;
        this.keys = keys;
        this.value = null;
        this.get();
    }
    // 根据vm和keys获取到最新的观察者
    get() {
        Dep.target = this;
        const keys = this.keys.split('.');
        let value = this.vm;
        console.log(keys)
        console.log(value)
        keys.forEach(_key => {
            value = value[_key];
        });
        this.value = value;
        console.log(value)
        Dep.target = null;
        return this.value;
    }
    update() {
        const oldValue = this.value;
        const newValue = this.get();
        if (oldValue !== newValue) {
            this.updateCb(oldValue, newValue)
        }
    }
}
let data = {
    name: 'cjg',
    obj: {
        name: 'zht'
    },
};
new Observer(data);
// 监听data对象的name属性，当data,name发生变化的时候，触发cd函数
new Watcher(data, 'name', (oldValue, newValue) => {
    console.log(oldValue,newValue)
})
data.name = 'zht';


