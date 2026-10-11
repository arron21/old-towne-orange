import { createRouter, createWebHistory } from 'vue-router';
import MapView from '../views/MapView.vue';
import BusinessesView from '../views/BusinessesView.vue';
import BusinessDetailView from '../views/BusinessDetailView.vue';
import HappeningNowView from '../views/HappeningNowView.vue';
import EventsView from '../views/EventsView.vue';

const routes = [
  {
    path: '/',
    redirect: '/map'
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView
  },
  {
    path: '/businesses',
    name: 'Businesses',
    component: BusinessesView
  },
  {
    path: '/business/:id',
    name: 'BusinessDetail',
    component: BusinessDetailView
  },
  {
    path: '/now',
    name: 'HappeningNow',
    component: HappeningNowView
  },
  {
    path: '/events',
    name: 'Events',
    component: EventsView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/map'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
