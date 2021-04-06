class HD {
    static PENDING = 'penging'
    static FUFILLED = 'fufilled'
    static REJECTED = 'rejected'
    constructor(executor) {
        this.status = HD.PENDING
        this.value = null
        this.callBackArr = []
        try {
            executor(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }
    }
    resolve(value) {
        if (this.status === HD.PENDING) {
            this.status = HD.FUFILLED
            this.value = value
            setTimeout(() => {
                this.callBackArr.map(callback => { callback.onFulfilled(value) })
            });
        }
    }
    reject(reason) {
        if (this.status === HD.PENDING) {
            this.status = HD.REJECTED
            this.value = reason
            setTimeout(() => {
                this.callBackArr.map(callback => { callback.onRejected(reason) })
            });
        }
    }
    then(onFulfilled, onRejected) {
        if (typeof onFulfilled != 'function') { onFulfilled = () => this.value }
        if (typeof onRejected != 'function') { onRejected = () => this.value }
        let promise = new HD((resolve, reject) => {
            if (this.status === HD.PENDING) {
                this.callBackArr.push(
                    {
                        onFulfilled: value => {
                            this.resolvePromise(promise, onFulfilled(value), resolve, reject)
                            // try {
                            //     let result = onFulfilled(value)
                            //     if (result instanceof HD) {
                            //         result.then(value => {
                            //             resolve(value)
                            //         }, reason => {
                            //             resolve(reason)
                            //         })
                            //     } else {
                            //         resolve(result)
                            //     }
                            // } catch (error) {
                            //     reject(error)
                            // }
                        },
                        onRejected: value => {
                            this.resolvePromise(promise, onRejected(value), resolve, reject)
                            // try {
                            //     let result = onRejected(value)
                            //     if (result instanceof HD) {
                            //         result.then(value => {
                            //             resolve(value)
                            //         }, reason => {
                            //             resolve(reason)
                            //         })
                            //     } else {
                            //         resolve(result)
                            //     }
                            // } catch (error) {
                            //     reject(error)
                            // }
                        }
                    }
                )
            }
            if (this.status === HD.FUFILLED) {
                setTimeout(() => {
                    this.resolvePromise(promise, onFulfilled(this.value), resolve, reject)
                    // try {
                    //     let result = onFulfilled(this.value)
                    //     if (result instanceof HD) {
                    //         result.then(value => {
                    //             resolve(value)
                    //         }, reason => {
                    //             resolve(reason)
                    //         })
                    //     } else {
                    //         resolve(result)
                    //     }
                    // } catch (error) {
                    //     reject(error)
                    // }
                })
            }
            if (this.status === HD.REJECTED) {
                setTimeout(() => {
                    this.resolvePromise(promise, onRejected(this.value), resolve, reject)
                    // try {
                    //     let result = onRejected(this.value)
                    //     if (result instanceof HD) {
                    //         result.then(value => {
                    //             resolve(value)
                    //         }, reason => {
                    //             resolve(reason)
                    //         })
                    //     } else {
                    //         resolve(result)
                    //     }
                    // } catch (error) {
                    //     reject(error)
                    // }
                })
            }
        })
        return promise

    }
    resolvePromise(promise, result, resolve, reject) {
        if (promise === result) {
            throw new TypeError('错了')
        }
        try {
            // let result = onRejected(this.value)
            if (result instanceof HD) {
                result.then(value => {
                    resolve(value)
                }, reason => {
                    resolve(reason)
                })
            } else {
                resolve(result)
            }
        } catch (error) {
            reject(error)
        }
    }
}


let Promise = HD
let p = new Promise((resolve, reject) => {
    // console.log('a');
    // setTimeout(() => {
    resolve('解决')    //     console.log('aaaaa');
    // }, 1000);
    // reject('拒绝')
})
    // console.log(p, 'pppp');
    // console.log(p.then(res => {
    //     console.log(res);
    // }), 'ooooo');
    // let a = p.then(res => {
    //     console.log(res);
    //     return a;
    // })
    // .then()
    .then(
        // res => {
        res => {
            console.log('===res1====', res);
            return res
        },
        rea => {
            // console.log(rea);
            // return rea
            return new Promise((resolve, reject) => {
                resolve('草泥马的')
            })
        }
        // }
    ).then(res => {
        console.log('====res2====', res);
    },
        rea => {
            console.log(rea);
            return rea
        })
console.log('p');