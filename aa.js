/**
 * 用来处理then方法返回结果包装成promise 方便链式调用
 * @param {*} promise2 then方法执行产生的promise 方便链式调用
 * @param {*} x then方法执行完成功回调或者失败回调后的result
 * @param {*} resolve 返回的promise的resolve方法 用来更改promise最后的状态
 * @param {*} reject 返回的promise的reject方法 用来更改promise最后的状态
 */
function resolvePromise(promise2, x, resolve, reject) {
    // 首先判断x和promise2是否是同一引用 如果是 那么就用一个类型错误作为Promise2的失败原因reject
    if (promise2 === x) return reject(new TypeError('typeError:大佬，你循环引用了!'));
    // called 用来记录promise2的状态改变，一旦发生改变了 就不允许 再改成其他状态
    let called;
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 如果x是一个对象或者函数 那么他就有可能是promise 需要注意 null typeof也是 object 所以需要排除掉
        //先获得x中的then 如果这一步发生异常了，那么就直接把异常原因reject掉
        try {
            let then = x.then;//防止别人瞎写报错
            if (typeof then === 'function') {
                //如果then是个函数 那么就调用then 并且把成功回调和失败回调传进去，如果x是一个promise 并且最终状态时成功，那么就会执行成功的回调，如果失败就会执行失败的回调如果失败了，就把失败的原因reject出去，做为promise2的失败原因，如果成功了那么成功的value时y，这个y有可能仍然是promise，所以需要递归调用resolvePromise这个方法 直达返回值不是一个promise
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject)
                }, error => {
                    if (called) return
                    called = true;
                    reject(error)
                })
            } else {
                resolve(x)
            }
        } catch (error) {
            if (called) return
            called = true;
            reject(error)
        }
    } else {
        // 如果是一个普通值 那么就直接把x作为promise2的成功value resolve掉
        resolve(x)
    }

}
