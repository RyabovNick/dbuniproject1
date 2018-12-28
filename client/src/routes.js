import Home from './components/HelloWorld.vue'
import Students from './components/Students.vue'

export const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/students', name: 'Students', component: Students }
]
