export default {
    name: 'SlimsTextVertical',
    render(h) {
        return h('div', { class: 'flex flex-col items-center' }, [
            h('div', 'S'),
            h('div', 'L'),
            h('div', { class: 'text-yellow-500' }, 'i'),
            h('div', 'M'),
            h('div', 'S'),
        ])
    }
}
