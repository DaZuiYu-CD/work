import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Locales from './locale';
import sys_config_locales from './sys_config.js';
import cscp_log_operation_locales from './cscp_log_operation.js'
import cscp_log_login_locales from './cscp_log_login.js'
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';
import zhTLocale from 'iview/src/locale/lang/zh-TW';
import image_attr_locales from'./image_attr.js';

Vue.use(VueI18n);

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.lang || localLang || 'zh-CN';

Vue.config.lang = lang;

// 多语言配置
const locales = Locales;

const mergeZH = Object.assign(zhLocale, locales['zh-CN'],cscp_log_operation_locales['zh-CN'],cscp_log_login_locales['zh-CN'],sys_config_locales['zh-CN'],image_attr_locales['zh-CN']);
const mergeEN = Object.assign(enLocale, locales['en-US'],cscp_log_operation_locales['en-US'],cscp_log_login_locales['en-US'],sys_config_locales['en-US'],image_attr_locales['en-US']);
const mergeTW = Object.assign(zhTLocale, locales['zh-TW'],cscp_log_operation_locales['zh-TW'],cscp_log_login_locales['zh-TW'],sys_config_locales['zh-TW'],image_attr_locales['zh-TW']);
Vue.locale('zh-CN', mergeZH);
Vue.locale('en-US', mergeEN);
Vue.locale('zh-TW', mergeTW);
