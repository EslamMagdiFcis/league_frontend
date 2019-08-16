import logIn from './components/logIn'
import teamView from './components/teamView'
import playerView from './components/playerView'


export default[
    {path: '/teams', component: teamView, name:'teams'},
    {path: '/login', component: logIn},
    {path: '/players', component: playerView, name:'players'},
    
    { path: '*', redirect: '/teams' }

]