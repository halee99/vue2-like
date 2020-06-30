import {Watcher} from './watcher'
import { log } from './utils';

// Dep依赖收集器的作用就是收集观察者

// 1.Dep有个静态属性target，当观察者初始化时，会在观察者的构造方法里，执行观察者的get方法，在观察者的get方法里，观察者会把自己赋值给Dep.target，意味着当前的观察者是自己；

// 2.dep.addSub方法把当前的观察者收集，存储到subs属性中；

// 3.dep.notify方法会调用所有观察者的update方法。

let uid = 0
class Dep {
  static target: Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    let deleteIndex = this.subs.findIndex(e => e.id === sub.id)
    if (deleteIndex === -1) {
      return
    }
    this.subs.splice(deleteIndex, 1)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    const subs = this.subs.slice()
    log('dep notify', this.id, subs)
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null
const targetStack = []

// Dep.target 是未入栈 targetStack 的虚拟顶

const pushTarget = (_target: Watcher) => {
  if (Dep.target) {
    targetStack.push(Dep.target)
  }
  Dep.target = _target
}

const popTarget = () => {
  Dep.target = targetStack.pop()
}

export {
  Dep,
  pushTarget,
  popTarget,
}