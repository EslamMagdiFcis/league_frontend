import logIn from './components/logIn'
import teamView from './components/teamView'
import playerView from './components/playerView'
import trainerView from './components/trainerView'
import matchView from './components/matchView'
import logOut from './components/logOut'
import registration from './components/registration'


export default[
    {path: '/teams', component: teamView, name:'teams'},
    {path: '/login', component: logIn, name: 'login'},
    {path: '/players', component: playerView, name:'players'},
    {path: '/trainers', component: trainerView, name:'trainers'},
    {path: '/matches', component: matchView, name:'matches'},
    {path: '/logout', component: logOut, name: 'logout'},
    {path: '/registration', component: registration, name: 'registration'},
    
    { path: '*', redirect: '/teams' }

]