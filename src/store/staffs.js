export default {
  namespaced: true,
  state: () => ({
    staffHeaders: [
      { text: 'Username', value: 'username' },
      { text: 'Full Name', value: 'fullName' }
    ],
    staffs: [
      {
        id: 1,
        username: 'Bob',
        fullName: 'Robert Thompson Long Name'
      },
      {
        id: 2,
        username: 'Stone',
        fullName: 'Stockholm Hershey Bar Guy'
      }
    ]
  }),
  actions: {
    queryStaffs ({ state }, { staffUsername }) {
      // Todo: Query
      return state.staffs.map(v => ({ text: v.username, value: v.id }))
    }
  }
}
