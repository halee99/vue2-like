import {log, throwError, onload} from './utils'
import {observe} from './observe'
import {Watcher, WatcherOptions} from './watcher'
import {templateCompile} from './compile'

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: null,
  set: null,
}

const proxy = (target: Object, sourceKey: string, key: string) => {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

interface VueProps {
  el: string
  data: object
  template?: string
  beforeCreate?: Function,
  created?: Function
  mounted?: Function,
}

interface anyData {
  [key: string]: any
}

class Vue implements anyData{
  el: string
  $el: HTMLElement
  $data: object
  _watcher: Watcher
  _watchers: Array<Watcher> = []

  constructor(props: VueProps) {
    this.run(props)
  }

  async run(props: VueProps) {
    this.init(props)

    props.beforeCreate && props.beforeCreate.call(this)

    this.initInjectionsAndReactivity()
    
    props.created && props.created.call(this)

    this.checkElAndTemplate()

    // todo beforeMount
    await onload()
    this.mount()
    props.mounted && props.mounted.call(this)
  }

  init(props: VueProps) {
    this.el = props.el
    this.$data = props.data
  }

  initInjectionsAndReactivity() {
    Object.keys(this.$data).forEach(key => {
      // 把 data 代理到 Vue 的实例上
      proxy(this, '$data', key)
    })
    observe(this.$data)
  }

  checkElAndTemplate() {
    // todo
  }

  mount() {
    this.$el = document.querySelector(this.el)
    if (!this.$el) {
      throwError('could not find', this.el)
      return
    }

    templateCompile(this)
  }

  addWatcher(watcher: Watcher) {
    this._watchers.push(watcher)
  }

  $watch(expOrFn: string | Function, cb: Function,options?: WatcherOptions) {
    let watcher = new Watcher(this, expOrFn, cb, options)
    this.addWatcher(watcher)
  }
}

type Component = Vue

export {
  Vue,
  Component,
}