import {Dep} from './dep'
import { observe } from './observe'

// js对象里目前存在的属性描述符有两种主要形式：数据描述符和访问器描述符。
// defineReactive函数的作用，就是把目标对象属性设置为访问器属性，这样可以在getter/setter方法中拦截属性的读写操作。如果属性是对象或数组，则递归执行observe函数，使目标对象深度可侦测。defineReactive函数里做了三件事：

// 1.创建了一个dep实例，这个dep 在访问器属性的 getter/setter 中被闭包引用，这个dep的作用是当目标对象属性发生写操作时，通知“感兴趣”的观察者；
// 2.如果属性是对象或者数组，则调用observe函数并把这个属性当做实参，目的是使目标对象深度可侦测；
// 3.使用Object.defineProperty函数把目标对象属性转成访问器属性，在getter方法里，通过执行dep.depend方法，收集对当前属性“感兴趣”的观察者；在setter方法里，执行observe(newVal)，把新增加的属性值变成可侦测的，并执行dep.notify()，通知对此属性“感兴趣”的所有观察者。

const defineReactive = (obj: Object, key: string) => {
  const dep = new Dep()
  console.log('defineReactive', key)
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // cater for pre-defined getter/setters
  const getter = property && property.get
  let val;
  if (!getter) {
    val = obj[key]
  }
  const setter = property && property.set
  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      observe(newVal)
      dep.notify()
    }
  })
}

const dependArray = (value: Array<any>) => {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}

export {
  defineReactive,
}