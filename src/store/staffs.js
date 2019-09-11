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
      }
    ]
  })
}
