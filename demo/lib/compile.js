'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Observer = function () {
    function Observer(data) {
        _classCallCheck(this, Observer);

        // 如果是对象，则返回
        if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
            return;
        }
        this.data = data;
        this.walk();
    }
    // 对传入的数据进行数据劫持


    _createClass(Observer, [{
        key: 'walk',
        value: function walk() {
            for (var key in this.data) {
                this.defineProperty(this.data, key, this.data[key]);
            }
        }
        // 创建当前属性的一个发布实例，使用Oject.deifneProperty来对当前的属性进行数据劫持。

    }, {
        key: 'defineProperty',
        value: function defineProperty(obj, key, val) {
            // 创建当前属性的发布者
            var dep = new Dep();
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
                get: function get() {
                    // 若当前有对该属性的依赖项，则将其加入到发布者的订阅队列里
                    if (Dep.target) {
                        dep.addSub(Dep.target);
                    }
                    return val;
                },
                set: function set(newVal) {
                    if (val === newVal) {
                        return;
                    }
                    val = newVal;
                    new Observer(newVal);
                    dep.notify();
                }
            });
        }
    }]);

    return Observer;
}();
// 发布者,将依赖该属性的watcher都加入subs数组，当该属性改变的时候，则调用所有依赖该属性的watcher的更新函数，触发更新。


var Dep = function () {
    function Dep() {
        _classCallCheck(this, Dep);

        this.subs = [];
    }

    _createClass(Dep, [{
        key: 'addSub',
        value: function addSub(sub) {
            if (this.subs.indexOf(sub) < 0) {
                this.subs.push(sub);
            }
        }
    }, {
        key: 'notify',
        value: function notify() {
            this.subs.forEach(function (sub) {
                sub.update();
            });
        }
    }]);

    return Dep;
}();

Dep.target = null;
// 观察者；

var Watcher = function () {
    /**
     *Creates an instance of Watcher.
     * @param {*} vm
     * @param {*} keys
     * @param {*} updateCb
     * @memberof Watcher
     */
    function Watcher(vm, keys, updateCb) {
        _classCallCheck(this, Watcher);

        console.log(vm, keys);
        console.log(updateCb);
        this.vm = vm;
        this.updateCb = updateCb;
        this.keys = keys;
        this.value = null;
        this.get();
    }
    // 根据vm和keys获取到最新的观察者


    _createClass(Watcher, [{
        key: 'get',
        value: function get() {
            Dep.target = this;
            var keys = this.keys.split('.');
            var value = this.vm;
            console.log(keys);
            console.log(value);
            keys.forEach(function (_key) {
                value = value[_key];
            });
            this.value = value;
            console.log(value);
            Dep.target = null;
            return this.value;
        }
    }, {
        key: 'update',
        value: function update() {
            var oldValue = this.value;
            var newValue = this.get();
            if (oldValue !== newValue) {
                this.updateCb(oldValue, newValue);
            }
        }
    }]);

    return Watcher;
}();

var data = {
    name: 'cjg',
    obj: {
        name: 'zht'
    }
};
new Observer(data);
// 监听data对象的name属性，当data,name发生变化的时候，触发cd函数
new Watcher(data, 'name', function (oldValue, newValue) {
    console.log(oldValue, newValue);
});
data.name = 'zht';