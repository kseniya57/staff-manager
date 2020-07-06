import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Users from '@/views/Users';
import SocialNetworks from '@/views/SocialNetworks';
import Bonuses from '@/views/Bonuses';
import Departments from '@/views/Departments';
import Positions from '@/views/Positions';
import Expenses from '@/views/Expenses';
import Payrolls from '@/views/Payrolls';
import Rights from '@/views/Rights';
import Roles from '@/views/Roles';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/socialNetworks',
      name: 'socialNetworks',
      component: SocialNetworks
    },
    {
      path: '/bonuses',
      name: 'bonuses',
      component: Bonuses
    },
    {
      path: '/departments',
      name: 'departments',
      component: Departments
    },
    {
      path: '/positions',
      name: 'positions',
      component: Positions
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: Expenses
    },
    {
      path: '/payrolls',
      name: 'payrolls',
      component: Payrolls
    },
    {
      path: '/rights',
      name: 'rights',
      component: Rights
    },
    {
      path: '/roles',
      name: 'roles',
      component: Roles
    }
  ]
});
