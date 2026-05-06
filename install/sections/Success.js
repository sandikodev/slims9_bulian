import Logo from '../components/Logo.js'
import SlimsText from '../components/SlimsText.js'
import SlimsTextVertical from '../components/SlimsTextVertical.js'
import Version from '../components/Version.js'

export default {
    name: 'Success',
    components: { Logo, SlimsText, SlimsTextVertical, Version },
    props: {
        optionalmsg: { type: Array, default: () => [] }
    },
    data() {
        return { showDetail: false }
    },
    computed: {
        hasUpgradeMessages() { return this.optionalmsg.length > 0 }
    },
    render(h) {
        const sidebar = h('div', { class: 'w-20 p-4' }, [h('div', [h('logo')]), h('slims-text-vertical', { class: 'text-lg font-medium text-gray-200 pt-4' }), h('version')])

        const upgradeSection = this.hasUpgradeMessages ? h('div', [
            h('h1', { class: 'text-3xl font-medium' }, 'Upgrade result'),
            h('p', { class: 'mb-4 mt-1 text-grey-700 leading-normal' }, [
                "Some upgrade process didn't work, but don't worry it doesn't have big impact on your ", h('slims-text'), ', ',
                h('strong', {
                    class: 'font-bold cursor-pointer',
                    attrs: { title: 'For more information' },
                    on: { click: () => { this.showDetail = !this.showDetail } }
                }, 'show detail'),
                '. Now it ready to use'
            ]),
            this.showDetail ? h('div', { class: 'rounded border bg-blue-100 border-blue-500 text-blue-500 px-4 py-2 mt-2 mb-8 text-lg' },
                this.optionalmsg.map(msg => h('p', { key: msg }, msg))
            ) : null,
        ]) : null

        return h('div', { class: 'h-screen flex' }, [
            sidebar,
            h('div', { class: 'flex-1 bg-gray-100 py-8 px-16' }, [
                h('h1', { class: 'text-3xl font-medium' }, ['New ', h('slims-text'), ' successful installed.']),
                h('p', { class: 'text-lg text-gray-700 tracking-wide mb-4' }, ['Congratulation, now you have ', h('slims-text'), ' in your machine.']),
                h('p', { class: 'rounded border bg-pink-100 border-pink-500 text-pink-500 px-4 py-2 mt-2 mb-8 text-lg' }, [
                    'Folder ', h('code', { class: 'font-bold px-2' }, 'install'), ' in your ', h('slims-text'), ' is already exist. For security reason please rename or remove it from your machine.'
                ]),
                upgradeSection,
                h('div', { class: 'w-2/3' }, [
                    h('h1', { class: 'text-2xl font-medium' }, 'Support Us'),
                    h('p', { class: 'mb-4 mt-1 text-grey-700 leading-normal' }, [
                        'Support ', h('slims-text'), ' development and become part of its history. We appreciate every donation to support us in any way. If you willing to make donation, please follow this link: ',
                        h('a', { class: 'text-blue-500 whitespace-no-wrap', attrs: { href: 'https://slims.web.id/web/pages/support-us/', target: '_blank' } }, 'https://slims.web.id/web/pages/support-us/')
                    ]),
                    h('p', ['List of individuals and or institutions who have made donations provided at ', h('code', 'supports.txt')]),
                    h('p', 'Your donation means a lot for SLiMS development ahead'),
                    h('div', { class: 'flex' }, [
                        h('a', { class: 'text-white bg-green-500 py-3 px-8 rounded-full font-bold mt-4 no-underline', attrs: { href: '../index.php' } }, 'Go to My SLiMS')
                    ])
                ])
            ])
        ])
    }
}
