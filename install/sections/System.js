import Logo from '../components/Logo.js'
import SlimsText from '../components/SlimsText.js'
import SlimsTextVertical from '../components/SlimsTextVertical.js'
import Version from '../components/Version.js'
import { Token } from '../js/utils.js'

export default {
    name: 'System',
    components: { Logo, SlimsText, SlimsTextVertical, Version },
    data() {
        return { data: [], isPass: false, loading: false }
    },
    mounted() { this.doCheck() },
    methods: {
        doCheck() {
            this.loading = true
            fetch('./api.php', {
                method: 'POST',
                headers: { Authorization: `Bearer ${Token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'system-requirement' })
            })
                .then(res => res.json())
                .then(res => { this.data = res.data; this.isPass = res.is_pass; this.loading = false })
        }
    },
    render(h) {
        const sidebar = h('div', { class: 'w-20 p-4' }, [
            h('div', [h('logo')]),
            h('slims-text-vertical', { class: 'text-lg font-medium text-gray-200 pt-4' }),
            h('version'),
        ])

        const items = Object.values(this.data || {}).map(d =>
            h('div', { class: 'pt-2 w-1/2' }, [
                h('h2', { class: 'font-medium' }, d.title),
                !d.data ? h('div', { class: 'text-gray-700' }, d.version || (d.status ? 'installed' : 'not installed')) : null,
                d.data ? h('div', { class: 'text-gray-700', domProps: { innerHTML: d.data } }) : null,
                !d.status ? h('div', { class: 'text-red-500' }, d.message) : null,
                h('div', { class: 'w-1/3 border-b pb-2' }),
            ])
        )

        return h('div', { class: 'min-h-screen flex' }, [
            sidebar,
            h('div', { class: 'flex-1 bg-gray-100 py-8 px-16' }, [
                h('h1', { class: 'text-3xl font-medium' }, 'System requirements'),
                h('p', { class: 'text-lg text-gray-700 tracking-wide mb-4' }, 'Checking the minimum system requirements to install SLiMS'),
                this.loading ? h('div', 'Loading...') : null,
                h('div', { class: 'flex flex-wrap' }, items),
                (!this.loading && this.isPass) ? h('button', {
                    class: 'mt-4 rounded-full bg-blue-500 py-2 px-4 text-blue-100 hover:bg-blue-400 focus:outline-none focus:bg-blue-600',
                    on: { click: () => this.$emit('click') }
                }, 'Next') : null,
            ])
        ])
    }
}
