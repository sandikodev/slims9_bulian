import Logo from '../components/Logo.js'
import SlimsText from '../components/SlimsText.js'
import SlimsTextVertical from '../components/SlimsTextVertical.js'
import SlimsButton from '../components/Button.js'
import Version from '../components/Version.js'
import { Token } from '../js/utils.js'

const selectWrap = 'inline-block relative w-64 mb-4'
const selectClass = 'appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
const inputClass = 'md:w-1/2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
const labelClass = 'block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1'

const chevron = h => h('div', { class: 'pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700' }, [
    h('svg', { class: 'fill-current h-4 w-4', attrs: { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20' } }, [
        h('path', { attrs: { d: 'M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' } })
    ])
])

export default {
    name: 'Account',
    components: { Logo, SlimsText, SlimsTextVertical, SlimsButton, Version },
    data() {
        return { username: 'admin', passwd: '', confirmPasswd: '', loading: false, message: [], isPass: false, sampleData: false, engines: [], engine: 'MyISAM' }
    },
    mounted() { this.getEngines() },
    methods: {
        submitForm() {
            if (this.passwd === this.confirmPasswd) this.doInstallation()
        },
        doInstallation() {
            this.loading = true
            fetch('./api.php', {
                method: 'POST',
                headers: { Authorization: `Bearer ${Token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'do-install', username: this.username, passwd: this.passwd, confirmPasswd: this.confirmPasswd, sampleData: this.sampleData, engine: this.engine })
            })
                .then(res => res.json())
                .then(res => {
                    this.loading = false
                    this.isPass = res.status
                    this.message = res.message
                    if (!this.isPass && (res.code === 5000 || res.code === 5001)) this.$emit('notwrite')
                    else if (this.isPass) this.$emit('success')
                })
        },
        async getEngines() {
            try {
                const r = await (await fetch('./api.php?storeage_engines=yes')).json()
                if (!r.status) throw r.message ?? 'Something error'
                this.engines = r.data
            } catch (e) { console.log(e) }
        },
        setSuggestion(engine) { return engine === 'Aria' ? engine + ' - recommended for crash safe' : engine }
    },
    render(h) {
        const sidebar = h('div', { class: 'w-20 p-4' }, [h('div', [h('logo')]), h('slims-text-vertical', { class: 'text-lg font-medium text-gray-200 pt-4' }), h('version')])

        const field = (label, id, model, type = 'text', ref = null) =>
            h('div', { class: 'w-full mt-3' }, [
                h('label', { class: labelClass, attrs: { for: id } }, label),
                h('input', {
                    class: inputClass,
                    attrs: { id, type, placeholder: `Enter ${label.toLowerCase()}`, required: true },
                    ref,
                    domProps: { value: this[model] },
                    on: { input: e => { this[model] = e.target.value } }
                }),
            ])

        const engineSelect = this.engines.length > 0 ? [
            h('h2', { class: 'font-medium text-lg' }, 'Storage Engine'),
            h('p', { class: 'mb-2' }, [h('slims-text'), ' comes with variant of database storage engine, it can improve your database performance such as crash-safe, transaction etc.']),
            h('div', { class: selectWrap }, [
                h('select', {
                    class: selectClass,
                    domProps: { value: this.engine },
                    on: { change: e => { this.engine = e.target.value } }
                }, this.engines.map(e => h('option', { attrs: { value: e[0], title: e[1] } }, this.setSuggestion(e[0])))),
                chevron(h)
            ])
        ] : []

        return h('div', { class: 'min-h-screen flex' }, [
            sidebar,
            h('div', { class: 'flex-1 bg-gray-100 py-8 px-16' }, [
                h('h1', { class: 'text-3xl font-medium' }, ['Install New ', h('slims-text'), h('span', { class: 'text-gray-500 text-lg' }, [h('span', { class: 'pl-4 pr-2' }, '\u2014'), ' 2 of 2'])]),
                h('p', { class: 'text-lg text-gray-700 tracking-wide mb-4' }, 'Please follow the instructions and fill the form if required'),
                h('h2', { class: 'font-medium text-lg' }, 'Generate Sample Data'),
                h('p', { class: 'mb-2' }, [h('slims-text'), ' can generate dummy data for you. Do it?']),
                h('div', { class: selectWrap }, [
                    h('select', {
                        class: selectClass,
                        domProps: { value: this.sampleData },
                        on: { change: e => { this.sampleData = e.target.value === 'true' } }
                    }, [
                        h('option', { attrs: { value: 'false' } }, "No, don't do that!"),
                        h('option', { attrs: { value: 'true' } }, 'Yes, please.'),
                    ]),
                    chevron(h)
                ]),
                ...engineSelect,
                h('h2', { class: 'font-medium text-lg' }, 'Super User profiles'),
                h('p', 'Please complete the following form with Super User login and password'),
                (!this.isPass && this.message && this.message.length > 0) ? h('div', { class: 'rounded border bg-pink-200 border-pink-500 text-pink-500 px-4 py-2 my-2 md:w-1/2' }, [
                    h('ul', this.message.map(m => h('li', m)))
                ]) : null,
                h('form', { class: 'w-full max-w-xl pb-4', on: { submit: e => { e.preventDefault(); this.submitForm() } } }, [
                    field('Username', 'db_host', 'username'),
                    field('Password', 'db_name', 'passwd', 'password', 'db_name'),
                    h('div', { class: 'w-full mt-3 mb-4' }, [
                        h('label', { class: labelClass }, 'Retype Password'),
                        h('input', {
                            class: inputClass,
                            attrs: { type: 'password', placeholder: 'Retype password', required: true },
                            ref: 'db_user',
                            domProps: { value: this.confirmPasswd },
                            on: { input: e => { this.confirmPasswd = e.target.value } }
                        }),
                    ]),
                    h('slims-button', { props: { loading: this.loading, disabled: this.loading, type: 'submit', text: 'Run the installation' } }),
                ])
            ])
        ])
    }
}
