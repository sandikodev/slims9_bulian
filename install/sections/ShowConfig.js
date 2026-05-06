import Logo from '../components/Logo.js'
import SlimsText from '../components/SlimsText.js'
import SlimsTextVertical from '../components/SlimsTextVertical.js'
import SlimsButton from '../components/Button.js'
import Version from '../components/Version.js'
import { Token } from '../js/utils.js'

export default {
    name: 'ShowConfig',
    components: { Logo, SlimsText, SlimsTextVertical, SlimsButton, Version },
    props: ['section'],
    data() {
        return { loading: false, isPass: null, message: '' }
    },
    computed: {
        action() {
            if (this.section === 'create-admin') return 're-install'
            if (this.section === 'select-version') return 're-upgrade'
        }
    },
    methods: {
        reRunInstall() {
            this.loading = true
            fetch('./api.php', {
                method: 'POST',
                headers: { Authorization: `Bearer ${Token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: this.action })
            })
                .then(res => res.json())
                .then(res => {
                    this.loading = false
                    this.isPass = res.status
                    this.message = res.message
                    if (!this.isPass && (res.code === 5000 || res.code === 5001)) this.$emit('notwrite')
                    else if (this.isPass) this.$emit('success')
                })
                .catch(err => { this.loading = false; this.isPass = false; this.message = err.message })
        }
    },
    render(h) {
        const sidebar = h('div', { class: 'w-20 p-4' }, [h('div', [h('logo')]), h('slims-text-vertical', { class: 'text-lg font-medium text-gray-200 pt-4' }), h('version')])

        const errorMessages = () => {
            if (!this.isPass && this.message) {
                const msgs = typeof this.message === 'object'
                    ? this.message.map(m => h('li', { class: 'py-2' }, m))
                    : [h('li', { class: 'py-2' }, this.message)]
                return h('div', { class: 'rounded border bg-pink-200 border-pink-500 text-pink-500 px-4 py-2 mt-2 mb-4 md:w-1/2' }, [h('ul', msgs)])
            }
            return null
        }

        return h('div', { class: 'h-screen flex' }, [
            sidebar,
            h('div', { class: 'flex-1 bg-gray-100 py-8 px-16' }, [
                h('h1', { class: 'text-3xl font-medium' }, 'Upsst... something wrong!'),
                h('p', { class: 'text-lg text-gray-700 tracking-wide mb-4' }, ['Sorry, but ', h('slims-text'), " can\u2019t write the config file."]),
                h('p', { class: 'text-lg text-gray-700 tracking-wide mb-4' }, [
                    'You can create the ', h('code', { class: 'text-red-500 text-sm' }, 'sysconfig.local.inc.php'),
                    ' file manually base on ', h('code', { class: 'text-red-500 text-sm' }, 'sysconfig.local.inc-sample.php'),
                    ' file in the ', h('code', { class: 'text-red-500 text-sm' }, 'config'), ' folder.',
                    h('br'), "Don\u2019t forget to configure database configuration with your database connection parameters/settings."
                ]),
                h('p', { class: 'text-lg text-gray-700 tracking-wide mb-4' }, "After you\u2019ve done that, click \u201CRun the installation\u201D."),
                errorMessages(),
                h('slims-button', { props: { loading: this.loading, disabled: this.loading, text: 'Run the installation' }, on: { click: this.reRunInstall } }),
            ])
        ])
    }
}
