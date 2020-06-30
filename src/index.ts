import {Vue} from './vue/vue'

const vm = new Vue({
  el: '#app',
  data: {
    message: '人类',
    name: '小明',
    age: 18,
    hello: 'Hello, mini Vue',
  }
})

vm.$watch('name', function(newValue, oldValue) {
  console.log('newValue', newValue, 'oldValue', oldValue)
})


window['vm'] = vm