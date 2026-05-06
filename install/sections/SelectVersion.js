import Logo from '../components/Logo.js'
import SlimsText from '../components/SlimsText.js'
import SlimsTextVertical from '../components/SlimsTextVertical.js'
import SlimsButton from '../components/Button.js'
import Version from '../components/Version.js'
import { Token } from '../js/utils.js'

const selectWrap = 'inline-block relative w-64 mb-4'
const selectClass = 'appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
const chevron = h => h('div', { class: 'pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700' }, [
    h('svg', { class: 'fill-current h-4 w-4', attrs: { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20' } }, [
        h('path', { attrs: { d: 'M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' } })
    ])
])

export default {
    name: 'SelectVersion',
    components: { Logo, SlimsText, SlimsTextVertical, SlimsButton, Version },
    data() {
        return { oldVersion: 0, isPass: null, message: '', loading: false, engines: [], engine: 'MyISAM', allVersion: [], btnLabel: 'Run the installation' }
    },
    mounted() { this.getVersionList(); this.getEngines() },
    methods: {
        doUpgrade() {
            this.loading = true
            fetch('./api.php', {
                method: 'POST',
                headers: { Authorization: `Bearer ${Token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'do-upgrade', oldVersion: this.oldVersion, engine: this.engine })
            })
                .then(res => res.json())
                .then(res => {
                    this.isPass = res.status
                    if (this.isPass) { this.$emit('success'); return }
                    this.message = res.message
                    this.loading = false
                    const hasPriorityError = this.message.filter(i => i.priority_error !== null)
                    const optionalError = this.message.filter(i => i.priority_error === null).map(i => i.optional_error)
                    if (!this.isPass && (hasPriorityError.length > 0 || res.code === 5000 || res.code === 5001)) {
                        this.btnLabel = 'Re-' + this.btnLabel
                    } else if (this.message.length > 0 && hasPriorityError.length < 1) {
                        this.$emit('redirectwithmsg', optionalError)
                    }
                })
                .catch(err => { this.isPass = false; this.message = [err.message]; this.loading = false })
        },
        async getEngines() {
            try {
                const r = await (await fetch('./api.php?storeage_engines=yes')).json()
                if (!r.status) throw r.message ?? 'Something error'
                this.engines = r.data
            } catch (e) { console.log(e) }
        },
        async getVersionList() {
            try {
                const r = await (await fetch('./api.php?versionlist=yes')).json()
                if (!r.status) throw r.message ?? 'Something error'
                this.allVersion = r.data.map((label, order) => ({ value: order, text: label }))
            } catch (e) { console.log(e) }
        },
        setSuggestion(engine) { return engine === 'Aria' ? engine + ' - recommended for crash safe' : engine }
    },
    render(h) {
        const sidebar = h('div', { class: 'w-20 p-4' }, [h('div', [h('logo')]), h('slims-text-vertical', { class: 'text-lg font-medium text-gray-200 pt-4' }), h('version')])

        const versionSelect = h('div', { class: selectWrap }, [
            h('select', {
                class: selectClass,
                domProps: { value: this.oldVersion },
                on: { change: e => { this.oldVersion = parseInt(e.target.value) } }
            }, this.allVersion.map(v => h('option', { attrs: { value: v.value } }, v.text))),
            chevron(h)
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

        return h('div', { class: 'h-screen flex' }, [
            sidebar,
            h('div', { class: 'flex-1 bg-gray-100 py-8 px-16' }, [
                h('h1', { class: 'text-3xl font-medium' }, ['Upgrade my previous ', h('slims-text'), h('span', { class: 'text-gray-500 text-lg' }, [h('span', { class: 'pl-4 pr-2' }, '\u2014'), ' 2 of 2'])]),
                h('p', { class: 'text-lg text-gray-700 tracking-wide mb-4' }, 'Please follow the instructions and fill the form if required'),
                h('h2', { class: 'font-medium text-lg' }, 'Your SLiMS Version'),
                h('p', { class: 'mb-2' }, ['Please select your current ', h('slims-text'), ' version before continue.']),
                (!this.isPass && this.message) ? h('div', { class: 'rounded border bg-pink-200 border-pink-500 text-pink-500 px-4 py-2 my-2 md:w-1/2' }, [
                    h('h2', { class: 'text-xl font-medium' }, "Oops! Something error"),
                    h('p', { class: 'text-lg tracking-wide mb-4' }, 'Please fix the error(s), and Re-Run Instalation again'),
                    h('ul', Array.isArray(this.message) ? this.message.map(m => h('li', { class: 'py-2' }, m.priority_error)) : [])
                ]) : null,
                versionSelect,
                ...engineSelect,
                h('slims-button', { props: { loading: this.loading, disabled: this.oldVersion < 1, text: this.btnLabel, type: 'button' }, on: { click: this.doUpgrade } }),
            ])
        ])
    }
}
