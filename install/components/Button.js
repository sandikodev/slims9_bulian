export default {
    name: 'SlimsButton',
    props: {
        text: { type: String, default: '' },
        color: { type: String, default: 'bg-yellow-500' },
        loading: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        type: { type: String, default: 'button' }
    },
    computed: {
        title() { return this.loading ? 'Please wait ...' : this.text },
        state() { return this.disabled ? ['bg-gray-500', 'cursor-not-allowed'] : [this.color] }
    },
    methods: {
        onClick(e) { this.$emit('click', e) }
    },
    render(h) {
        return h('button', {
            attrs: { type: this.type, disabled: this.disabled },
            class: ['text-white', 'py-3', 'px-5', 'rounded-full', 'font-bold', 'flex', 'justify-center', 'items-center', 'focus:outline-none', ...this.state],
            on: { click: this.onClick }
        }, [
            this.title,
            this.loading ? h('div', { class: 'lds-dual-ring ml-3' }, [h('div'), h('div')]) : null
        ])
    }
}
