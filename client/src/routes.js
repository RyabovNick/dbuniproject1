import Home from './components/HelloWorld.vue'
import Students from './components/Students.vue'

export const routes = [
    { path: '/home', name: 'Home', component: Home },
    { path: '/', name: 'Students', component: Students }
]
