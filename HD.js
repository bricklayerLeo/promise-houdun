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
                this.callBackArr.map(callback => {
                    callback.onFulfilled(value)
                })
            });
        }
    }
    reject(reason) {
        if (this.status === HD.PENDING) {
            this.status = HD.REJECTED
            this.value = reason
            setTimeout(() => {
                this.callBackArr.map(callback => {
                    callback.onRejected(reason)
                })
            });
        }
    }
    then(onFulfilled, onRejected) {
        if (typeof onFulfilled != 'function') {
            onFulfilled = () => { }
        }
        if (typeof onRejected != 'function') {
            onRejected = () => { }
        }
        return new HD((resolve, reject) => {
            if (this.status === HD.PENDING) {
                this.callBackArr.push(
                    {
                        // onFulfilled,
                        // onRejected
                        onFulfilled: value => {
                            try {
                                let result = onFulfilled(value)
                                resolve(result)
                            } catch (error) {
                                onRejected(error)
                            }
                        },
                        onRejected: value => {
                            try {
                                let result = onRejected(value)
                                resolve(result)
                            } catch (error) {
                                onRejected(error)
                            }
                        }
                    }
                )
            }
            if (this.status === HD.FUFILLED) {
                setTimeout(() => {
                    try {
                        // onFulfilled(this.value)
                        let result = onFulfilled(this.value)
                        resolve(result)
                    } catch (error) {
                        onRejected(error)
                    }
                })
            }
            if (this.status === HD.REJECTED) {
                setTimeout(() => {
                    try {
                        let result = onRejected(this.value)
                        resolve(result)
                    } catch (error) {
                        onRejected(error)
                    }
                })
            }
        })
    }
}