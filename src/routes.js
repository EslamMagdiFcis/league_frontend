import logIn from './components/logIn'
import teamView from './components/teamView'

export default[
    {path: '/teams', component: teamView, name:'teams'},
    {path: '/login', component: logIn},
    
    { path: '*', redirect: '/teams' }

]