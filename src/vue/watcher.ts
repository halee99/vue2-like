import {Dep, pushTarget, popTarget} from './dep'
import { log, isObject, throwError } from './utils'
import { Component } from './vue'

// 观察者的作用是监听目标对象的变化。观察者构造方法中的参数expOrFn，可以是表达式，如果是表达式的话，只接受键路径，例如"a.b.c"；对于更复杂的表达式，可以使用一个函数替代。

// 1.Watcher的构造方法里执行get方法里，get方法里执行expOrFn，expOrFn中对目标对象进行求值，触发Dep收集观察者；

// 2.当目标对象更新时，会调用观察者的update方法，如果是同步更新则接着调用run方法，如果是异步更新则执行queueWatcher方法，但无论是同步更新还是异步更新，最终都会执行run方法；

// 3.在run方法里，执行get方法，重新求expOrFn的值，如果有cb参数，则调用cb函数，把新值和旧值当做实参传入。

interface WatcherOptions {
  deep?: boolean
  immediate?: boolean
}

let uid = 0
class Watcher {
  vm: Component
  expression: string
  cb: Function
  id: number
  getter: Function
  value: any
  deep: boolean = false
  lazy: boolean = false
  dirty: boolean = false
  sync: boolean = true
  depIds: Set<number | string> = new Set()

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: WatcherOptions,
    isRenderWatcher?: boolean
  ) {
    log('create Watcher')
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    if (options) {
      this.deep = !!options.deep
    }

    this.cb = cb
    this.id = ++uid
    this.expression = process.env.NODE_ENV !== 'production' ? expOrFn.toString() : ''
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.value = this.lazy ? undefined : this.get()

    if (options && options.immediate) {
      log('watcher immediate')
      this.value = undefined
      this.update()
    }
  }

  get () {
    // 该 Watcher 被 赋值给 Dep.target
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 执行了 expOrFn 所表现的属性的getter, 触发了依赖收集
      value = this.getter.call(vm, vm)
    } catch (e) {
      throw e
    } finally {
      if (this.deep) {
        // watch deep
        // traverse(value)
      }
      popTarget()
    }
    return value
  }

  update () {
    log('watcher update', this.id)
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }

  run () {
    const value = this.get()
    if ( value !== this.value || isObject(value) || this.deep) {
      const oldValue = this.value
      this.value = value
      
      try {
        this.cb.call(this.vm, value, oldValue)
      } catch (e) {
        throwError(e, this.vm, `callback for watcher "${this.expression}"`)
      }
    }
  }

  addDep (dep: Dep) {
    const id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id)
      dep.addSub(this)
    }
  }
}

const parsePath = (exp: string) => {
  return function() {
    const linkedKeys: Array<string> = exp.split('.')
    return linkedKeys.reduce((obj, key) => {
      return obj[key]
    }, this)
  }
}

const queueWatcher = (watcher: Watcher) => {
  // todo
  setTimeout(() => {
    watcher.run()
  }, 0)
}

export {
  Watcher,
  WatcherOptions,
}