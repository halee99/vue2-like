import {Dep} from './dep'
import {defineReactive} from './defineReactive'
import {log, throwError} from './utils'

// observe函数创建一个Observer实例，在Observer构造函数里做了三件事：

// 1.首先new了一个依赖收集器，这个dep的作用是，当目标对象增删属性时，通知对目标对象“感兴趣”的观察者；

// 2.给目标对象添加不可枚举的__ob__属性，指向Observer实例；

// 3.最后遍历对象属性，并执行defineReactive函数。

const observe = (value: any): Observer | void => {
  let ob: Observer | void
  if (typeof(value) === 'object') {
    ob = new Observer(value)
  }
  return ob
}

class Observer {
  value: object
  dep: Dep

  constructor (value: object) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // .todo
      throwError('todo Array')
    } else {
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}

const def = (obj: Object, key: string, value: any): void => {
  Object.defineProperty(obj, key, {
    enumerable: false,
    configurable: false,
    value: value,
  })
}

export {
  observe,
}