export default (instances) => ({
  mounted () {
    instances.push(this)
  },
  beforeDestroy () {
    instances = instances.filter(v => v !== this)
  }
})
