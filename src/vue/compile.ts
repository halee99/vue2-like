import {Watcher} from "./watcher"
import { Component } from "./vue"
import { throwError, log, replaceAll } from "./utils"
import { Dep } from "./dep"

const templateCompile = (vm: Component) => {
  const dom = nodesCompile(vm, vm.$el)
  // vm.$el.appendChild(dom)
}

const nodesCompile = (vm: Component, rootNode) => {
  let frag = document.createDocumentFragment()

  let arr = rootNode.childNodes
  for (let i = 0; i < arr.length; i++) {
    let child = arr[i]
    let compiledNode = nodeCompile(vm, child)
    // frag.appendChild(compiledNode)
  }

  return frag
}

const nodeCompile = (vm: Component, node: Element | HTMLElement): DocumentFragment | Element => {
  // 节点类型为元素
  if (node.nodeType === Node.ELEMENT_NODE) {
    return handerElementNode(vm, node)
  }

  // 节点类型为 text
  if (node.nodeType === Node.TEXT_NODE) {
    return handerTextNode(vm, node)
  }

  throwError('todo node.nodeType', node.nodeType)
}

const handerElementNode = (vm: Component, node: Element | HTMLElement): DocumentFragment | Element => {
  var attr = node.attributes
  // 解析属性
  for (let i = 0; i < attr.length; i++) {
    if (attr[i].nodeName === 'v-model') {
      let key = attr[i].nodeValue
      log('**** v-model', key)
      if (vm.hasOwnProperty(key)) {
        node.addEventListener('input', function (e) {
          vm[key] = (<HTMLInputElement> e.target).value
        });
        (<HTMLInputElement> node).value = vm[key]
      } else {
        throwError('could not find', key)
      }
      node.removeAttribute('v-model')
    }
  }
  
  if (node.childNodes.length > 0) {
    return nodesCompile(vm, node)
  }
  return node
}

const handerTextNode = (vm: Component, node: Element): DocumentFragment | Element => {
  let reg = /\{\{(.*?)\}\}/g
  let originalStr = node.nodeValue.trim()
  let textMap = {}
  let timer
  let res

  let results = []
  while(res = reg.exec(originalStr)){
    res[1] = res[1].trim()
    results.push(res)
  }
  if (results.length === 0) {
    return
  }

  const setNodeValue = () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      let newText = originalStr
      results.forEach(res => {
        let replaceStr = res[0]
        let key = res[1]
        let value = textMap[key]
        newText = replaceAll(newText, replaceStr, value)
      })
      node.nodeValue = newText
    }, 0)
  }

  for(let i = 0; i < results.length; i++) {
    let key = results[i][1]
    if (vm.hasOwnProperty(key)) {
      textMap[key] = vm[key]
      vm.$watch(key, function (value) {
        textMap[key] = value
        
        setNodeValue()
      }, {immediate: true})
      // vm.addWatcher(watcher)
    } else {
      throwError('could not find', key)
    }
  }

  setNodeValue()
  return node
}

export {
  templateCompile,
}