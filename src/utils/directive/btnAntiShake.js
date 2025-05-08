export default (app) => {
    app.directive('btnAntiShake', {
        mounted(el, binding) {
            let timer = null

            el.addEventListener('click', () => {
                if (timer) return // 如果正在冷却，直接忽略

                binding.value() // 执行事件

                timer = setTimeout(() => {
                    timer = null // 冷却结束，可以再次点击
                }, 2000) // 冷却时间（毫秒）
            })
        }
    })
}
