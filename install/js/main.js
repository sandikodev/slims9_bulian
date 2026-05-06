import Welcome from '../sections/Welcome.js'
import System from '../sections/System.js'
import Tasks from '../sections/Tasks.js'
import Install from '../sections/Install.js'
import Upgrade from '../sections/Upgrade.js'
import SelectVersion from '../sections/SelectVersion.js'
import Account from '../sections/Account.js'
import ShowConfig from '../sections/ShowConfig.js'
import Success from '../sections/Success.js'

new Vue({
    el: '#app',
    components: {
        Welcome,
        System,
        Tasks,
        Install,
        Upgrade,
        SelectVersion,
        Account,
        ShowConfig,
        Success
    },
    data() {
        return {
            section: 'welcome',
            lastSection: '',
            optionalMessage: []
        }
    },
    methods: {
        selectTask(task) {
            this.section = task
        },
        setSection(current, last) {
            this.section = current
            this.lastSection = last
        },
        setOptionalMsg(message) {
            this.optionalMessage = message
            this.section = 'success'
        }
    },
    render(h) {
        const s = this.section
        return h('div', { class: 'bg-transparent font-light' }, [
            s === 'welcome'        ? h('welcome',        { on: { click: () => { this.section = 'system' } } }) : null,
            s === 'system'         ? h('system',         { on: { click: () => { this.section = 'select-task' } } }) : null,
            s === 'select-task'    ? h('tasks',          { on: { click: this.selectTask } }) : null,
            s === 'install'        ? h('install',        { on: { next: () => { this.section = 'create-admin' } } }) : null,
            s === 'upgrade'        ? h('upgrade',        { on: { next: () => { this.section = 'select-version' } } }) : null,
            s === 'select-version' ? h('select-version', { on: { redirectwithmsg: this.setOptionalMsg, success: () => { this.section = 'success' } } }) : null,
            s === 'create-admin'   ? h('account',        { on: { notwrite: () => this.setSection('show-config', 'create-admin'), success: () => { this.section = 'success' } } }) : null,
            s === 'show-config'    ? h('show-config',    { props: { section: this.lastSection } }) : null,
            s === 'success'        ? h('success',        { props: { optionalmsg: this.optionalMessage } }) : null,
        ])
    }
})
