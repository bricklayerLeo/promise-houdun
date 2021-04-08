//==========================================对象不一定都有原型==========================================
let xj = { name: '湘军' }
console.log(xj);
console.log(xj.hasOwnProperty('name')); //判断对象是否有某个属性


let hd = Object.create(null, { //Object.create()这种方式创建的对象 是完全的数据字典对象 没有原型
    name: {
        value: '后盾人'
    }
})   //vue 数据驱动原理 Object.defindproperty重写数组原型方法啊 用到该方法
console.log(hd); //打印 没有 __proto__这个属性 
console.log(hd.hasOwnProperty('name'));
//================================函数有多个长辈(作为普通对象 和构造函数)=============================================

function User() { } //长辈有prototype   和   __proto__两个
console.dir(User);
User.__proto__.view = function () {
    console.log('user function view method');
}
User.view() //当函数 作为对象使用时 调用的是  __proto__ 长辈方法




function User() { } //长辈有prototype   和   __proto__两个
console.dir(User);
User.prototype.show = function () {
    console.log('傻逼');
}

let hd = new User()

hd.show() //当作为构造函数使用时候 调用的长辈就是  prototype  方法
console.log(User.prototype == hd.__proto__); //实例对象__proto__等于构造函数的prototype


// 函数也是对象。函数 有两个长辈prototype和__proto__
//当函数作为 对象使用时，使用的是__proto__上面的方法 例如 call apply等
//当函数 是作为构造函数使用 使用的是prototype上面的方法 所有实例共享的属性和方法


// ================================== 原型关系=======================================================
//

let hd = new Object()
hd.name = '后端'
console.dir(Object);

//Object可以作为 对象 和 构造函数使用 它上面的prototype和__proto__上一层（长辈）是null
//
//  https://www.bilibili.com/video/BV17J411y7XZ?p=6&spm_id_from=pageDriver  看到p6
//