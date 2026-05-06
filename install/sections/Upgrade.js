import Logo from '../components/Logo.js'
import SlimsText from '../components/SlimsText.js'
import SlimsTextVertical from '../components/SlimsTextVertical.js'
import Version from '../components/Version.js'
import { Token } from '../js/utils.js'

const inputClass = 'md:w-1/2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
const labelClass = 'block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1'

export default {
    name: 'Upgrade',
    components: { Logo, SlimsText, SlimsTextVertical, Version },
    data() {
        return { host: 'localhost', port: '3306', name: '', user: '', pass: '', isPass: null, field: '', message: '', btnLabel: 'Test Connection' }
    },
    methods: {
        testConnection() {
            if (this.btnLabel === 'Please Wait') return
            this.btnLabel = 'Please Wait'
            fetch('./api.php', {
                method: 'POST',
                headers: { Authorization: `Bearer ${Token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'test-connection-upgrade', host: this.host, port: this.port, name: this.name, user: this.user, pass: this.pass })
            })
                .then(res => res.json())
                .then(res => {
                    this.btnLabel = 'Test Connection'
                    this.isPass = res.status
                    this.message = res.message
                    this.field = res.field
                    if (this.field === 'name') this.$refs.db_name.focus()
                    if (this.field === 'user') this.$refs.db_user.focus()
                })
        }
    },
    render(h) {
        const sidebar = h('div', { class: 'w-20 p-4' }, [h('div', [h('logo')]), h('slims-text-vertical', { class: 'text-lg font-medium text-gray-200 pt-4' }), h('version')])

        const field = (label, id, model, type = 'text', ref = null) =>
            h('div', { class: 'w-full mt-3' }, [
                h('label', { class: labelClass, attrs: { for: id } }, label),
                h('input', {
                    class: inputClass,
                    attrs: { id, type, placeholder: `Enter ${label.toLowerCase()}`, required: type !== 'password' },
                    ref,
                    domProps: { value: this[model] },
                    on: { input: e => { this[model] = e.target.value } }
                }),
            ])

        return h('div', { class: 'min-h-screen flex' }, [
            sidebar,
            h('div', { class: 'flex-1 bg-gray-100 py-8 px-16' }, [
                h('h1', { class: 'text-3xl font-medium' }, ['Upgrade my previous ', h('slims-text'), h('span', { class: 'text-gray-500 text-lg' }, [h('span', { class: 'pl-4 pr-2' }, '\u2014'), ' 1 of 2'])]),
                h('p', { class: 'text-lg text-gray-700 tracking-wide mb-4' }, 'Please follow the instructions and fill the form if required'),
                h('h2', { class: 'font-medium text-lg' }, 'Database information'),
                h('p', 'Please complete the following form with your database connection parameters/settings'),
                (!this.isPass && this.message) ? h('div', { class: 'rounded border bg-pink-200 border-pink-500 text-pink-500 px-4 py-2 my-2 md:w-1/2' }, this.message) : null,
                h('form', { class: 'w-full max-w-xl', on: { submit: e => { e.preventDefault(); this.testConnection() } } }, [
                    field('Database host', 'db_host', 'host'),
                    field('Database port', 'db_port', 'port'),
                    field('Database name', 'db_name', 'name', 'text', 'db_name'),
                    field('Database username', 'db_user', 'user', 'text', 'db_user'),
                    field('Database password', 'db_pass', 'pass', 'password'),
                    !this.isPass ? h('button', { class: 'mt-4 mb-4 rounded-full bg-gray-500 py-2 px-4 text-gray-100 hover:bg-gray-700 focus:outline-none focus:bg-gray-600', attrs: { type: 'submit' } }, this.btnLabel) : null,
                    this.isPass ? h('button', { class: 'mt-4 mb-4 rounded-full bg-green-500 py-2 px-4 text-green-100 hover:bg-green-700 focus:outline-none focus:bg-green-600', attrs: { type: 'button' }, on: { click: () => this.$emit('next') } }, 'Connection OK. Next') : null,
                ])
            ])
        ])
    }
}
