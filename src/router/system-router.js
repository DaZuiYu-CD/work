import Vue from 'vue'
import Main from '@/views/Main.vue'
import ctsiComponents from 'biyi-admin'
Vue.prototype.$ctsiComponents = ctsiComponents

// 不作为Main组件的子页面展示
let singleRouter = [
    {
        path: '/welcome',
        name: 'welcome',
        component: () => import('../views/welcome.vue')
    }
]

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
let otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/welcome',
    component: Main,
    children: [
        {
            path: 'home',
            title: {
                i18n: 'home'
            },
            name: 'home_index',
            component: () =>
                import('../views/home/home.vue')
        }

                        ,
        {
            path: '/entity/sys_config_item/:id',
            title: 'sys_config_item',
            name: 'sys_config_item',
            component: resolve => {
                require(['@/views/entity/sys_config_item.vue'], resolve);
            }
        },
        {
            path: '/entity/image_attr_item/:id',
                title: 'image_attr_item',
            name: 'image_attr_item',
            component: resolve => {
            require(['@/views/entity/image_attr_item.vue'], resolve);
        }
}
                            ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
let appRouter = [

    {
    path: '/entity',
    icon: 'md-list',
    name: 'entity',
    title: '数据库表',
    component: Main,
    children: [

        {
            path: 'sys_config',
            icon: 'md-list',
            name: 'sys_config',
            title: 'sys_config',
            component: resolve => {
                require(['@/views/entity/sys_config.vue'], resolve);
            }
        } ,
        {
            path: 'image_attr',
                icon: 'md-list',
            name: 'image_attr',
            title: 'image_attr',
            component: resolve => {
            require(['@/views/entity/image_attr.vue'], resolve);
            }
        },
        {
          path: 'sys_config_tree',
              icon: 'md-list',
            name: 'sys_config_tree',
            title: 'sys_config_tree',
            component: resolve => {
            require(['@/views/entity/sys_config_tree.vue'], resolve);
          }
        }
]
    }

]

if(Vue.prototype.$ctsiComponents) {
    singleRouter.push(...Vue.prototype.$ctsiComponents.singleRouters)
    for (let item of Vue.prototype.$ctsiComponents.otherRouters) {
        otherRouter.children.push(item)
    }
    appRouter.push(...Vue.prototype.$ctsiComponents.appRouters)
}

export { singleRouter, otherRouter, appRouter }

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    otherRouter,
    ...appRouter,
    ...singleRouter
]
